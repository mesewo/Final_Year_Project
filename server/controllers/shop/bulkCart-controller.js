import BulkCart from "../../models/BulkCart.js";
import Product from "../../models/Product.js";

// Add to Bulk Cart
export const addToBulkCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Use Product model directly
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const sellerId = product.seller || null;
    // If you want to support storeId, you need to add a store field to Product or handle it differently
    // For now, we'll set storeId to null or you can remove it from the schema if not needed
    // const storeId = null;

    let cart = await BulkCart.findOne({ userId });

    if (!cart) {
      cart = new BulkCart({ userId, items: [], isBulk: true });
    }

    cart.isBulk = true; // Always true for bulk cart

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity,/* storeId,*/ sellerId });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    //   cart.items[findCurrentProductIndex].storeId = storeId;
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

// Fetch Bulk Cart Items
export const fetchBulkCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    const cart = await BulkCart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice seller",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Bulk cart not found!",
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
      sellerId: item.sellerId || item.productId.seller,
      // storeId: item.storeId, // Only include if you have store info
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
        isBulk: true,
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

// Update Bulk Cart Item Quantity
export const updateBulkCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await BulkCart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Bulk cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Bulk cart item not present!",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice seller",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
      sellerId: item.sellerId || (item.productId ? item.productId.seller : null),
      // storeId: item.storeId, // Only include if you have store info
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
        isBulk: true,
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

// Delete Bulk Cart Item
export const deleteBulkCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await BulkCart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice seller",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Bulk cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice seller",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
      sellerId: item.sellerId || (item.productId ? item.productId.seller : null),
      // storeId: item.storeId, // Only include if you have store info
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
        isBulk: true,
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

// export const clearBulkCart = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User id is required!",
//       });
//     }
//     const cart = await BulkCart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Bulk cart not found!",
//       });
//     }
//     cart.items = [];
//     await cart.save();
//     res.status(200).json({
//       success: true,
//       message: "Bulk cart cleared.",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error clearing bulk cart.",
//     });
//   }
// };

export default {
  addToBulkCart,
  updateBulkCartItemQty,
  deleteBulkCartItem,
  fetchBulkCartItems,
  // clearBulkCart
};