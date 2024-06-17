const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  OrderNo: { type: Number, required: true },
  "Order Date": { type: String, required: true },
  CustNo: { type: Number, required: true },
  "Product Code": { type: Number, required: true },
  "Product Name": { type: String, required: true },
  "Product Quantity": { type: Number, required: true },
  "Product Price": { type: Number, required: true },
  Total: { type: Number, required: true },
  "ModeOf Payment": { type: String, required: true }
});

module.exports = mongoose.model("Orders", orderSchema, "Orders");
