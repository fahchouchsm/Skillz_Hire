const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const mainCategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  subcategories: [subcategorySchema],
});

const MainCategory = mongoose.model("MainCategory", mainCategorySchema);

module.exports = MainCategory;
