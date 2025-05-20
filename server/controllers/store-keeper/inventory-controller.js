import Product from "../../models/Product.js";
import InventoryLog from "../../models/InventoryLog.js";

export const updateStock = async (req, res) => {
  try {
    const { productId, quantity, notes } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const previousStock = product.totalStock;
    product.totalStock = quantity;
    await product.save();

    
    await InventoryLog.create({
      product: productId,
      changeType: "adjustment",
      quantity: quantity - previousStock,
      previousStock,
      newStock: quantity,
      performedBy: req.user.id,
      notes,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const requestStockReplenishment = async (req, res) => {
  try {
    const { productId, requestedQuantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // In a real app, this would create a purchase order or notification
    res.status(200).json({
      success: true,
      message: "Stock replenishment request submitted",
      data: {
        product: product.title,
        currentStock: product.totalStock,
        requestedQuantity,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getInventory = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getStoreInventory = async (req, res) => {
  try {
    const filter = req.query.filter;
    let query = {};
    if (filter === "low-stock") {
      query.totalStock = { $lte: 5 }; // or your threshold
    }
    const products = await Product.find(query);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default {
  updateStock,
  requestStockReplenishment,
  getInventory,
  getStoreInventory,
};
