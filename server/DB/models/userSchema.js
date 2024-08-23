const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, trim: true },
  firstName: {
    type: String,
    required: true,
    trim: true,
    set: (value) => capitalizeFirstLetter(value),
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    set: (value) => capitalizeFirstLetter(value),
  },
  password: { type: String, required: true },
  isSeller: { type: Boolean, default: false },
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller" },
  pfpLink: {
    type: String,
    default: "http://localhost:3031/imgs/default.png",
  },
  lastOnline: { type: Date, default: Date.now },
});

const SellerSchema = new Schema({
  email: { type: String, required: true, unique: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  firstName: { type: String },
  lastName: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  bio: { type: String, default: "" },
  mainCategory: {
    type: Schema.Types.ObjectId,
    ref: "MainCategory",
    required: true,
  },
  subCategories: [
    {
      type: Schema.Types.ObjectId,
      ref: "MainCategory.subcategories",
    },
  ],
  accountType: {
    type: String,
    enum: ["individual", "company"],
    required: true,
  },
  individualData: {
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
  },
  companyData: {
    username: { type: String },
    adresse: { type: String },
    url: { type: String },
  },
  reviews: [
    {
      rating: { type: Number, required: true },
      comment: { type: String },
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
  ],
  reviewCount: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("isSeller") && this.isSeller) {
    try {
      const seller = await mongoose
        .model("Seller")
        .findOneAndUpdate(
          { email: this.email },
          { $set: { email: this.email, username: this.username } },
          { new: true, upsert: true }
        );
      this.sellerId = seller._id;
    } catch (err) {
      return next(err);
    }
  } else if (!this.isSeller) {
    this.sellerId = undefined;
  }
  next();
});

UserSchema.post("save", async function (doc) {
  if (this.isSeller) {
    try {
      await mongoose.model("Seller").findOneAndUpdate(
        { email: this.email },
        {
          $set: {
            email: this.email,
            username: this.username,
            userId: this._id,
          },
        },
        { new: true, upsert: true }
      );
    } catch (err) {
      console.error("Error updating seller after user save:", err);
    }
  }
});

SellerSchema.pre("save", async function (next) {
  try {
    await mongoose
      .model("User")
      .findOneAndUpdate(
        { email: this.email },
        { $set: { email: this.email } },
        { new: true, upsert: true }
      );
    next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model("User", UserSchema);
const Seller = mongoose.model("Seller", SellerSchema);

module.exports = { User, Seller };
