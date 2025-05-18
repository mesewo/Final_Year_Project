import User from "../../models/User.js";
// import Store from "../../models/Store.js";

export const getSellerStore = async (req, res) => {
  // console.log("getSellerStore called", req.user);
  try {
    const seller = await User.findById(req.user.id).populate("store");
    if (!seller || !seller.store) {
      return res.status(404).json({ success: false, message: "No store assigned to this seller" });
    }
    res.json({ success: true, store: seller.store });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};