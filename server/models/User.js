import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: function () {
        return !this.googleId; // Only required for non-Google users
      },
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Only required for non-Google users
      },
      minlength: [6, "Password must be at least 6 characters"],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: [
        "admin",
        "buyer",
        "seller",
        "store_keeper",
        "assistance",
        "accountant",
        "factman",
      ],
      default: "buyer",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailOTP: String,
    emailOTPExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    profile: {
      firstName: String,
      lastName: String,
      phone: {
        type: String,
        validate: {
          validator: function (v) {
            return /^[0-9]{10,15}$/.test(v);
          },
          message: "Please enter a valid phone number",
        },
      },
      address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
      },
      avatar: String, // <-- Add this line for profile image URL
    },
    sellerProfile: {
      storeName: String,
      taxId: String,
      bankAccount: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        return ret;
      },
    },
  }
);
export default mongoose.model("User", UserSchema);
