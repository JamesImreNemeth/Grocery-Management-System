//       The following inputs will work on PostMan
//
//       http://localhost:3000/employees/login
//       http://localhost:3000/order
//       http://localhost:3000/products/
//       http://localhost:3000/swagger

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const ordersRoutes = require("./routes/orderRoutes");         
const employeeRoutes = require("./routes/employeeRoutes");
const connectToDatabase = require("./Repositories/mongoDBAtlas");
const setupSwagger = require("./swagger");

const app = express();

// Connect to Database
connectToDatabase();

app.use(bodyParser.json());

// CORS Allowed Origins
const allowedOrigins = [ 
  "http://127.0.0.1:5500",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
};

// Allow CORS specific routes
app.use("/products", cors(corsOptions));
app.use("/employees", cors(corsOptions));
app.use("/orders", cors(corsOptions));

// Implement Pre-Flight CORS
app.options("/products", cors(corsOptions));
app.options("/employees", cors(corsOptions));
app.options("/orders", cors(corsOptions));

// Routes
app.use("/products", productRoutes);
app.use("/employees", employeeRoutes);
app.use("/orders", ordersRoutes);         

// Swagger Documentation
setupSwagger(app);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
