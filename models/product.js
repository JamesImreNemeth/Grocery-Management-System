const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  ProductCode: { type: Number, required: true },
  ProductName: { type: String, required: true },
  ProductQuantity: { type: Number, required: true },
  Product_price: { type: Number, required: true },
});

module.exports = mongoose.model("Products", productSchema, "Products");
