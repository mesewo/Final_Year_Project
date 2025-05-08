import Feature from "../../models/Feature.js";

// Add a new feature
export const addFeature = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const newFeature = new Feature({
      title,
      description,
      image,
    });

    await newFeature.save();

    res.status(201).json({
      success: true,
      message: "Feature added successfully",
      data: newFeature,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add feature",
    });
  }
};

// Get all features
export const getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.find();

    res.status(200).json({
      success: true,
      data: features,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch features",
    });
  }
};

// Delete a feature
export const deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFeature = await Feature.findByIdAndDelete(id);

    if (!deletedFeature) {
      return res.status(404).json({
        success: false,
        message: "Feature not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feature deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete feature",
    });
  }
};

export default {
  addFeature,
  getAllFeatures,
  deleteFeature,
};