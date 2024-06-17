
const express = require("express");
const router = express.Router();
const Product = require("../models/product"); 
const authenticateToken = require("../Auth/auth");

// GET

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - ProductCode
 *         - ProductName
 *         - ProductQuantity
 *         - Product_price
 *       properties:
 *         ProductCode:
 *           type: integer
 *           description: Unique code identifying the product
 *         ProductName:
 *           type: string
 *           description: Name of the product
 *         ProductQuantity:
 *           type: integer
 *           description: Quantity available
 *         Product_price:
 *           type: number
 *           description: Price of the product
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all products retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

// GET all products
router.get("/", authenticateToken, async (req, res) => {
    try {
        const products = await Product.find({}); // Use Mongoose to fetch all products
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors with server failure response
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a specific product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product Retrieved 
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

// GET a specific product by ID - Retrieves a single product based on ID using Mongoose
router.get("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" }); // Product not found
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: `Failed to get product (${error})` }); // Server error
    }
});

// POST

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             ProductCode: 123
 *             ProductName: Cookies
 *             ProductQuantity: 20
 *             Product_price: 4
 *     responses:
 *       201:
 *         description: Product Created.
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

// POST a new product using Mongoose
router.post("/", authenticateToken, async (req, res) => {
    try {
        const newProduct = new Product(req.body); // Create a new product instance with the request body
        const savedProduct = await newProduct.save(); // Save the new product to the database
        res.status(201).json(savedProduct); // Return the saved product with 201 status code
    } catch (error) {
        // If there's a validation error or any other error, return a 400 Bad Request with the error message
        res.status(400).json({ message: error.message });
    }
});

// PUT

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Updates a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             ProductCode: 456
 *             ProductName: Cookies
 *             ProductQuantity: 10
 *             Product_price: 4
 *     responses:
 *       200:
 *         description: Product Updated 
 *       400:
 *         description: Missing fields
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

// PUT to update a product completely using Mongoose
router.put("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;
    const productUpdates = req.body;

    // List of all required fields for a product to ensure complete data submission
    const requiredFields = [
        'ProductCode', 'ProductName', 'ProductQuantity', 'Product_price'
    ];

    // Check each field in requiredFields to see if any are missing from the product object
    const missingFields = requiredFields.filter(field => productUpdates[field] === undefined);

    // If any required fields are missing, respond with a 400 status and list the missing fields
    if (missingFields.length > 0) {
        return res.status(400).json({ message: "Missing required fields:   " + missingFields.join("?    ") });
    }
    
    try {
        // Using Mongoose to find and update the document, and optionally return the original document before the update
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: productUpdates },
            { new: false, runValidators: true }  // Option to not return the new document but the original before update
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Returning the original and updated product information along with a success message
        res.json({
            message: "Product updated successfully",
            Original_Product: updatedProduct,  // This will contain the original data before the update
            Updated_Product: productUpdates  // This reflects the updates made
        });
    } catch (error) {
        console.error("Update error:", error); // Logging the error
        res.status(500).json({ message: error.message });
    }
});

// PATCH

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a part of a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             ProductQuantity: 8
 *             Product_price: 2.5
 *     responses:
 *       200:
 *         description: Product Updated
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

// PATCH to update parts of a product
router.patch("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;

    try {
        // First, fetch the original document using Mongoose
        const originalProduct = await Product.findById(id);

        if (!originalProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Now perform the update using Mongoose
        const updateResult = await Product.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }  // Option to return the updated document
        );

        if (!updateResult) {
            return res.status(404).json({ message: "Product not found after update" });
        }

        // Return both the original and the updated product
        res.json({
            message: "Product updated successfully",
            Original_Product: originalProduct, // This will contain the original data before the update
            Updated_Product: updateResult // This will contain the updated data
        });
    } catch (error) {
        console.error("Update error:", error); // Logging the error
        res.status(500).json({ message: error.message });
    }
});

// DELETE

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product Deleted
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

// DELETE a product
router.delete("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Product.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: `Failed to delete product (${error})` });
    }
});


module.exports = router;
