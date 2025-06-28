import Store from "../../models/Store.js";

export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.json({ stores });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json({ store });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};