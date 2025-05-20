import Product from "../../models/Product.js";
import StoreProduct from "../../models/StoreProduct.js";

export const getSellerProducts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const products = await Product.find({ seller: req.user.id });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addSellerProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    // 1. Create the product
    const productData = { ...req.body, seller: req.user.id };
    const product = new Product(productData);
    await product.save();

    // 2. Create the StoreProduct entry
    const { storeId, quantity } = req.body;
    if (!storeId || !quantity) {
      return res.status(400).json({ success: false, message: "storeId and quantity are required" });
    }
    const storeProduct = new StoreProduct({
      product: product._id,
      store: storeId,
      seller: req.user.id, // <-- Add seller here
      quantity,
    });
    await storeProduct.save();

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUnsoldProducts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const products = await Product.find({
      seller: req.user.id,
      soldCount: 0,
    });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getApprovedSellerProducts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    // Find all StoreProduct docs for this seller, and populate product
    const storeProducts = await StoreProduct.find({ seller: req.user.id })
      .populate("product");
    // Extract product info and add stock from StoreProduct
    const products = storeProducts
      .filter(sp => sp.product)
      .map(sp => ({
        ...sp.product.toObject(),
        totalStock: sp.quantity, // Use store stock
      }));
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

