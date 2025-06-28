import Product from "../models/Product.js";
import StoreProduct from "../models/StoreProduct.js";
import ProductRequest from "../models/ProductRequest.js";
import Notification from "../models/Notification.js";
import Order from "../models/Order.js";
import BulkCart from "../models/BulkCart.js";

// Helper: Notify Factman if product is low or out of stock
async function notifyFactmanIfLowOrOutOfStock(product) {
  if (!product) return;

  // Prevent duplicate notifications for the same product
  const existing = await Notification.findOne({
    product: product._id,
    type: "low_stock",
    forRole: "factman",
    seen: false,
  });

  if (!existing && product.totalStock <= (product.lowStockThreshold ?? 5)) {
    await Notification.create({
      type: "low_stock",
      message:
        product.totalStock === 0
          ? `${product.title} is OUT OF STOCK in factory!`
          : `${product.title} is LOW in factory stock (${product.totalStock})`,
      product: product._id, // Always use Product's _id
      forRole: "factman",
      seen: false,
      createdAt: new Date(),
    });
    // console.log("Notification created for Factman!", product.title, product.totalStock);
  }
}

// Example: Get all bulk orders
export const getBulkOrdersForStorekeeper = async (req, res) => {
  const { storekeeperId } = req.params;
  try {
    const orders = await Order.find({ type: "bulk", storekeeper: storekeeperId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch bulk orders" });
  }
};


export const approveBulkOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId).populate("orderItems.productId");
    if (!order || order.type !== "bulk" || order.orderStatus !== "pending") {
      return res.status(404).json({ success: false, message: "Bulk order not found or already handled" });
    }
    // Check stock for each product
    for (const item of order.orderItems) {
      const product = await Product.findById(item.productId);
      if (!product || product.totalStock < item.quantity) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${item.title}` });
      }
    }
    // Deduct stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.productId);
      product.totalStock -= item.quantity;
      await product.save();
    }
    order.orderStatus = "approved";
    order.orderUpdateDate = new Date();
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Reject a bulk order
export const rejectBulkOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order || order.type !== "bulk" || order.orderStatus !== "pending") {
      return res.status(404).json({ success: false, message: "Bulk order not found or already handled" });
    }
    order.orderStatus = "rejected";
    order.orderUpdateDate = new Date();
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Seller makes a request
export const requestProduct = async (req, res) => {
  const { productId, storeId, quantity, isBulk } = req.body;
  const sellerId = req.user.id;
  const requestedBy = req.user.id;  

  try {
    const product = await Product.findById(productId);
    if (!product || product.totalStock < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }

    let requestData = {
      product: productId,
      quantity,
      isBulk: !!isBulk,
      requestedBy,
    };

    if (req.user.role === "seller") {
      if (!storeId) {
        return res.status(400).json({ success: false, message: "Store ID is required for sellers." });
      }
      requestData.store = storeId;
      requestData.seller = req.user.id;
    }

    const existingRequest = await ProductRequest.findOne({
      product: productId,
      requestedBy,
      store: requestData.store,
      seller: sellerId,
      status: "pending",
      isBulk: !!isBulk,
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: "You already have a pending request." });
    }

    const request = new ProductRequest({
      product: productId,
      store: storeId,
      requestedBy,
      quantity,
      seller: sellerId,
      isBulk: !!isBulk,
    });

    await request.save();

    if (isBulk) {
      const bulkCart = await BulkCart.findOne({ userId: requestedBy });
      if (bulkCart) {
        bulkCart.items = [];
        await bulkCart.save();
      }
    }

    res.status(201).json({ success: true, request });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Approve product request
export const approveProductRequest = async (req, res) => {
  const { requestId } = req.params;
  const storekeeperId = req.user.id;

  try {
    const request = await ProductRequest.findById(requestId).populate("product");
    if (!request || request.status !== "pending") {
      return res.status(404).json({ success: false, message: "Request not found or already handled" });
    }

    // Deduct from factory stock
    const product = await Product.findById(request.product._id);
    if (product.totalStock < request.quantity) {
      return res.status(400).json({ success: false, message: "Not enough factory stock" });
    }
    product.totalStock -= request.quantity;
    await product.save();

    // Notify Factman if low or out of stock
    await notifyFactmanIfLowOrOutOfStock(product);

    // Add to store stock (or update existing)
    if (request.store) {
      const existingStoreProduct = await StoreProduct.findOne({
        product: request.product._id,
        store: request.store,
      });

      if (existingStoreProduct) {
        existingStoreProduct.quantity += request.quantity;
        existingStoreProduct.seller = request.seller;
        await existingStoreProduct.save();
      } else {
        await StoreProduct.create({
          product: request.product._id,
          store: request.store,
          seller: request.seller,
          quantity: request.quantity,
        });
      }
    }
    // Update request status
    request.status = "approved";
    request.reviewedAt = new Date();
    request.reviewedBy = storekeeperId;
    await request.save();

     const order = new Order({
      userId: request.requestedBy,
      orderItems: [{
        productId: request.product._id,
        title: request.product.title,
        image: request.product.image,
        price: request.product.price,
        quantity: request.quantity,
      }],
      totalAmount: request.product.price * request.quantity,
      orderStatus: "approved",
      type: request.isBulk ? "bulk" : "normal",
      orderDate: new Date(),
      ...(request.store ? { store: request.store } : {}),
      // store: request.store,
      // Add other fields as needed
    });
    await order.save();

    res.json({ success: true, message: "Product request approved", request });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Reject product request
export const rejectProductRequest = async (req, res) => {
  const { requestId } = req.params;
  const storekeeperId = req.user.id;

  try {
    const request = await ProductRequest.findById(requestId);
    if (!request || request.status !== "pending") {
      return res.status(404).json({ success: false, message: "Request not found or already handled" });
    }

    request.status = "rejected";
    request.reviewedAt = new Date();
    request.reviewedBy = storekeeperId;
    await request.save();

    res.json({ success: true, message: "Product request rejected", request });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await ProductRequest.find()
      .populate("product")
      .populate("seller")
      .populate("store")
      .populate("requestedBy")
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get my requests
export const getMyRequests = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const requests = await ProductRequest.find({ seller: sellerId })
      .populate("product")
      .populate("store");
    res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Trend of seller product requests (grouped by day)
export const getProductRequestTrend = async (req, res) => {
  try {
    const { start, end } = req.query;
    const match = { status: "approved" }; // Only approved requests
    if (start && end) {
      match.requestedAt = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }
    const trend = await ProductRequest.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$requestedAt" } },
          totalRequests: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(trend);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Notify for all low/out-of-stock products (call on server start)
export async function notifyAllLowOrOutOfStockProducts() {
  const products = await Product.find();
  for (const product of products) {
    const existing = await Notification.findOne({
      product: product._id,
      type: "low_stock",
      forRole: "factman",
      seen: false,
    });
    if (!existing && product.totalStock <= (product.lowStockThreshold ?? 5)) {
      await Notification.create({
        type: "low_stock",
        message:
          product.totalStock === 0
            ? `${product.title} is OUT OF STOCK in factory!`
            : `${product.title} is LOW in factory stock (${product.totalStock})`,
        product: product._id,
        forRole: "factman",
        seen: false,
        createdAt: new Date(),
      });
      // console.log("Notification created for Factman!", product.title, product.totalStock);
    }
  }
}

// Add or update product and remove notification if restocked
export const addOrUpdateProduct = async (req, res) => {
  const { productId, totalStock } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const previousStock = product.totalStock;
    product.totalStock = totalStock;
    await product.save();

    // If product was previously low/out of stock but now is sufficiently stocked, delete notifications
    if (previousStock <= (product.lowStockThreshold ?? 5) && totalStock > (product.lowStockThreshold ?? 5)) {
      const result = await Notification.deleteMany({
        product: product._id,
        type: "low_stock",
        forRole: "factman"
      });
      console.log(`Deleted ${result.deletedCount} low stock notifications for product ${product.title}`);

      // Optionally create a "restocked" notification
      await Notification.create({
        type: "restocked",
        message: `${product.title} has been restocked (now ${totalStock} in stock)`,
        product: product._id,
        forRole: "factman",
        seen: false,
        createdAt: new Date(),
      });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const markRequestDelivered = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await ProductRequest.findById(requestId);
    if (!request || request.status !== "approved") {
      return res.status(400).json({ success: false, message: "Only approved requests can be delivered." });
    }
    request.status = "delivered";
    await request.save();

    // Also update the related Order (if exists)
    const order = await Order.findOne({
      userId: request.requestedBy,
      "orderItems.productId": request.product,
      orderStatus: "approved"
    });
    if (order) {
      order.orderStatus = "delivered";
      order.orderUpdateDate = new Date();
      await order.save();
    }

    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};