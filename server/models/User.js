import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "buyer", "seller", "store_keeper", "assistance", "accountant"],
    default: "buyer",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
  },
  sellerProfile: {
    storeName: String,
    taxId: String,
    bankAccount: String,
  },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);