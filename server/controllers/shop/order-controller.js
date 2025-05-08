import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems, // still comes from frontend as "cartItems"
      addressInfo,
      totalAmount,
      paymentMethod,
    } = req.body;

    // Convert cartItems to orderItems
    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      title: item.title,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

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
    });

    await order.save();

    // Delete cart after order
    await Cart.findByIdAndDelete(cartId);

    // Update product stock
    for (let item of orderItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.totalStock -= item.quantity;
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { totalStock: -item.quantity } }
        );        
      }
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Error while creating order",
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

export default {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};