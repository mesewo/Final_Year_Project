import Cart from "../../models/Cart.js";
import StoreProduct from "../../models/StoreProduct.js";

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, isBulk, storeId } = req.body;

    if (!userId || !productId || !storeId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Use both productId and storeId to find the correct StoreProduct
    const storeProduct = await StoreProduct.findOne({ product: productId, store: storeId });
    if (!storeProduct) {
      return res.status(404).json({
        success: false,
        message: "StoreProduct mapping not found for this product in this store",
      });
    }

    const sellerId = storeProduct.seller;


    if (!storeId || !sellerId) {
      return res.status(400).json({
        success: false,
        message: "Product missing store or seller info!",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    else if(typeof isBulk !== 'undefined') {
    cart.isBulk = !!isBulk;
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity, storeId, sellerId });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
      // Also update storeId and sellerId in case product info changed
      cart.items[findCurrentProductIndex].storeId = storeId;
      cart.items[findCurrentProductIndex].sellerId = sellerId;
    }

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

// Fetch Cart Items
export const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice store seller",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
      storeId: item.storeId || item.productId.store,
      sellerId: item.sellerId || item.productId.seller,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
        isBulk: cart.isBulk,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

// Update Cart Item Quantity
export const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice store seller",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
      storeId: item.storeId || (item.productId ? item.productId.store : null),
      sellerId: item.sellerId || (item.productId ? item.productId.seller : null),
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
        isBulk: cart.isBulk,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

// Delete Cart Item
export const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice store seller",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice store seller",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
      storeId: item.storeId || (item.productId ? item.productId.store : null),
      sellerId: item.sellerId || (item.productId ? item.productId.seller : null),
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
        isBulk: cart.isBulk,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

export default {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};