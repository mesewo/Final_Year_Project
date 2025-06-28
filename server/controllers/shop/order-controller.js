import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import Notification from "../../models/Notification.js";
import StoreProduct from "../../models/StoreProduct.js";
import User from "../../models/User.js";
import Store from "../../models/Store.js";
import { v4 as uuidv4 } from "uuid";

export const createOrder = async (req, res) => {
  try {
    const { userId, cartId, cartItems, addressInfo, paymentMethod, isBulk } = req.body;

    // Group cartItems by storeId and sellerId
    const ordersMap = {};
    for (const item of cartItems) {
      const key = `${item.storeId}_${item.sellerId}`;
      if (!ordersMap[key]) ordersMap[key] = [];
      ordersMap[key].push(item);
    }

    const createdOrders = [];

    for (const [key, items] of Object.entries(ordersMap)) {
      const { storeId, sellerId } = items[0];
      const store = await Store.findById(storeId);
      if (!store || !store.assignedSellers || store.assignedSellers.length === 0) {
        return res.status(400).json({ message: "No seller assigned to this store" });
      }
      // const sellerId = store.assignedSellers[0]; // assign to first seller

      const orderItems = items.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const totalAmount = orderItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      const orderType = isBulk ? "bulk" : "normal";

      const tx_ref = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

      let storekeeperId = null;
      if (orderType === "bulk") {
        // Find the main storekeeper (assuming role is 'storekeeper' or 'factman')
        const storekeeperUser = await User.findOne({ role: "store_keeper" }); // or "factman"
        if (storekeeperUser) {
          storekeeperId = storekeeperUser._id;
        }
      }

      const order = new Order({
        userId,
        cartId,
        orderItems,
        addressInfo,
        totalAmount,
        paymentMethod,
        paymentStatus: "pending",
        orderStatus: "pending",
        orderDate: new Date(),
        orderUpdateDate: new Date(),
        paymentId: "",
        payerId: "",
        store: storeId,
        seller: sellerId, // always from store.assignedSellers
        tx_ref,
        type: orderType,
        storekeeper: storekeeperId,
      });

      await order.save();
      createdOrders.push(order);

      // Update stock for each item
      for (let item of orderItems) {
        await StoreProduct.updateOne(
          { product: item.productId, store: storeId, seller: sellerId },
          { $inc: { quantity: -item.quantity } }
        );
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { totalStock: -item.quantity } }
        );
      }
    }

    // Delete cart after all orders are created
    await Cart.findByIdAndDelete(cartId);

    res.status(201).json({
      success: true,
      message: "Orders created successfully",
      orderIds: createdOrders.map((o) => o._id),
      tx_refs: createdOrders.map((o) => o.tx_ref),
      orders: createdOrders,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Error while creating orders",
    });
  }
};

export const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

export const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Approve a bulk order
// export const approveBulkOrder = async (req, res) => {
//   const { orderId } = req.params;
//   const storekeeperId = req.user.id;

//   try {
//     const order = await Order.findById(orderId).populate("orderItems.productId");
//     if (!order || order.type !== "bulk" || order.orderStatus !== "pending") {
//       return res.status(404).json({ success: false, message: "Bulk order not found or already handled" });
//     }

//     // Check stock for each product
//     for (const item of order.orderItems) {
//       const product = await Product.findById(item.productId);
//       if (!product || product.totalStock < item.quantity) {
//         return res.status(400).json({ success: false, message: `Not enough stock for ${item.title}` });
//       }
//     }

//     // Deduct stock
//     for (const item of order.orderItems) {
//       const product = await Product.findById(item.productId);
//       product.totalStock -= item.quantity;
//       await product.save();
//     }

//     // Update order status
//     order.orderStatus = "approved";
//     order.orderUpdateDate = new Date();
//     order.reviewedBy = storekeeperId;
//     await order.save();

//     // Optionally: Notify buyer and/or admin
//     // await Notification.create({ ... });

//     res.json({ success: true, message: "Bulk order approved", order });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // Reject a bulk order
// export const rejectBulkOrder = async (req, res) => {
//   const { orderId } = req.params;
//   const storekeeperId = req.user.id;

//   try {
//     const order = await Order.findById(orderId);
//     if (!order || order.type !== "bulk" || order.orderStatus !== "pending") {
//       return res.status(404).json({ success: false, message: "Bulk order not found or already handled" });
//     }

//     order.orderStatus = "rejected";
//     order.orderUpdateDate = new Date();
//     order.reviewedBy = storekeeperId;
//     await order.save();

//     // Optionally: Notify buyer and/or admin
//     // await Notification.create({ ... });

//     res.json({ success: true, message: "Bulk order rejected", order });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const getBulkOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ type: "bulk" }).sort({ createdAt: -1 });
//     res.json({ success: true, orders });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to fetch bulk orders" });
//   }
// };

export default {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  // approveBulkOrder,
  // rejectBulkOrder,
  // getBulkOrders,
};