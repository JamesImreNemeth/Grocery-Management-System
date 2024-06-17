const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  Empid: { type: Number, required: true, unique: true },
  Username: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Emp_photo: { type: String, default: null },
});

module.exports = mongoose.model("Employees", employeeSchema, "Employees");
