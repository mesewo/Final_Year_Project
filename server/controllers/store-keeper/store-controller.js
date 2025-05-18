// controllers/storeController.js
import Store from '../../models/Store.js';
import User from '../../models/User.js';
// Create a new store
export const createStore = async (req, res) => {
  const { name, location, description, assignedSellers } = req.body;

  try {
    const store = new Store({
      name,
      location,
      description,
      createdBy: req.user.id,
      assignedSellers,
    });

    await store.save();

    // Update each assigned seller's store field
    if (Array.isArray(assignedSellers)) {
      await User.updateMany(
        { _id: { $in: assignedSellers } },
        { $set: { store: store._id } }
      );
    }

    res.status(201).json({ success: true, store });
  } catch (err) {
    console.error("Error creating store:", err);
    res.status(500).json({ success: false, message: "Failed to create store" });
  }
};


// Update store sellers
export const updateStoreSellers = async (req, res) => {
  const { storeId } = req.params;
  const { assignedSellers } = req.body;

  try {
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });

    // Find previous sellers
    const prevSellers = store.assignedSellers.map(id => id.toString());

    // Update assigned sellers in store
    store.assignedSellers = assignedSellers;
    await store.save();

    // Set store field for newly assigned sellers
    await User.updateMany(
      { _id: { $in: assignedSellers } },
      { $set: { store: store._id } }
    );

    // Remove store field from users no longer assigned
    const removedSellers = prevSellers.filter(id => !assignedSellers.includes(id));
    if (removedSellers.length > 0) {
      await User.updateMany(
        { _id: { $in: removedSellers }, store: store._id },
        { $unset: { store: "" } }
      );
    }

    res.json({ success: true, store });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating sellers" });
  }
};

// Get all stores
export const getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    // If you need to list sellers with each store in the initial fetch:
    const storesWithSellers = await Promise.all(
      stores.map(async (store) => {
        const sellers = await User.find({ store: store._id, role: 'seller' })
          .select('userName email');
        return { ...store.toObject(), sellers };
      })
    );
    res.status(200).json(storesWithSellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single store by ID
export const getStoreById = async (req, res) => {
  try {
    const storeId = req.params.id;
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Find all sellers associated with this store
    const sellers = await User.find({ store: storeId, role: 'seller' })
      .select('userName email'); // Select only userName and email

    // Combine the store data with the associated sellers
    const storeWithSellers = { ...store.toObject(), sellers };

    res.status(200).json(storeWithSellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a store by ID
export const updateStore = async (req, res) => {
  try {
    const updatedStore = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedStore) return res.status(404).json({ message: 'Store not found' });
    res.status(200).json(updatedStore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a store by ID
export const deleteStore = async (req, res) => {
  try {
    const deletedStore = await Store.findByIdAndDelete(req.params.id);
    if (!deletedStore) return res.status(404).json({ message: 'Store not found' });
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
