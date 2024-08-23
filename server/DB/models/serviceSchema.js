const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    reviews: [
      {
        rating: { type: Number, required: true },
        comment: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

PostSchema.post("save", async function (doc, next) {
  try {
    const seller = await mongoose.model("Seller").findById(doc.sellerId);
    if (seller) {
      seller.reviewCount = await mongoose.model("Post").countDocuments({
        sellerId: doc.sellerId,
        "reviews.0": { $exists: true },
      });

      const allReviews = await mongoose
        .model("Post")
        .aggregate([
          {
            $match: { sellerId: doc.sellerId, "reviews.0": { $exists: true } },
          },
          { $unwind: "$reviews" },
          {
            $group: {
              _id: "$sellerId",
              totalRating: { $sum: "$reviews.rating" },
              reviewCount: { $sum: 1 },
            },
          },
        ]);

      if (allReviews.length > 0) {
        seller.totalRating = allReviews[0].totalRating;
        seller.averageRating = (
          allReviews[0].totalRating / allReviews[0].reviewCount
        ).toFixed(2);
      }

      await seller.save();
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
