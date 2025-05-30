import { imageUploadUtil } from '../../helpers/cloudinary.js';
import Product from '../../models/Product.js';
import Feedback from '../../models/Feedback.js';

// Centralized error handling function
const handleError = (res, error, message = 'An error occurred') => {
  console.error(error);
  res.status(500).json({
    success: false,
    message,
  });
};

// Handle image upload to Cloudinary
const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Directly upload the buffer to Cloudinary instead of converting to base64
    const result = await imageUploadUtil(req.file.buffer);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    handleError(res, error, 'Image upload failed');
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    // Validation: Check if essential fields are provided
    if (!image || !title || !description || !category || !brand || price === undefined || totalStock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (error) {
    handleError(res, error, 'Error adding product');
  }
};

// Fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (error) {
    handleError(res, error, 'Error fetching products');
  }
};

// Edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    
    // Update product fields
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === undefined ? findProduct.price : price;
    findProduct.salePrice = salePrice === undefined ? findProduct.salePrice : salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;
    
    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (error) {
    handleError(res, error, 'Error editing product');
  }
};

const getProductWithFeedbacks = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      const feedbacks = await Feedback.find({ productId: id });
      res.status(200).json({
        success: true,
        data: {
          ...product.toObject(),
          feedbacks,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching product details' });
    }
  };

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    handleError(res, error, 'Error deleting product');
  }
};

export {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
  getProductWithFeedbacks,
};