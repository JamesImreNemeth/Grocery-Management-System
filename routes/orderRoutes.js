
const express = require("express");
const router = express.Router();
const Order = require("../models/orders"); 
const authenticateToken = require("../Auth/auth");

// GET

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - OrderNo
 *         - CustNo
 *         - OrderDate
 *         - ProductCode
 *         - ProductName
 *         - ProductQuantity
 *         - ProductPrice
 *         - Total
 *         - ModeOfPayment
 *       properties:
 *         OrderNo:
 *           type: integer
 *           description: The unique identifier for the order
 *         CustNo:
 *           type: integer
 *           description: The customer number associated with the order
 *         OrderDate:
 *           type: string
 *           format: date
 *           description: The date when the order was placed
 *         ProductCode:
 *           type: integer
 *           description: The code for the ordered product
 *         ProductName:
 *           type: string
 *           description: The name of the product ordered
 *         ProductQuantity:
 *           type: integer
 *           description: The quantity of the product ordered
 *         ProductPrice:
 *           type: number
 *           description: The price per unit of the product
 *         Total:
 *           type: number
 *           description: The total price for the order
 *         ModeOfPayment:
 *           type: string
 *           description: The payment method used for the order
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Gets all Orders
 *     description: Returns a list of all orders in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order List.
 *       500:
 *         description: Server error
 */


// GET all orders
router.get("/", authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a order by OrderNo

/**
 * @swagger
 * /orders/{OrderNo}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Gets a SINGLE Order
 *     description: Returns a single order by its OrderNo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: OrderNo
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the order to retrieve.
 *     responses:
 *       200:
 *         description: Details of order.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Server error
 */

// GET a specific order by OrderNo - Retrieves a single order based on OrderNo using Mongoose
router.get("/:OrderNo", authenticateToken, async (req, res) => {
    const orderNo = parseInt(req.params.OrderNo);
    try {
        const order = await Order.findOne({ OrderNo: orderNo });
        if (!order) {
            return res.status(404).json({ message: "Invalid order number provided" }); // Order not found
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: `Failed to get orders (${error})` }); // Server error
    }
});

// POST

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create a new Order
 *     description: Adds a new order to the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *           example:
 *             OrderNo: 2700
 *             CustNo: 222
 *             Order Date: "17/06/2024"
 *             Product Code: 12345
 *             Product Name: "Test Post"
 *             Product Quantity: 40
 *             Product Price: 3
 *             Total: 120
 *             ModeOf Payment: "Credit Card"
 *     responses:
 *       201:
 *         description: Order created.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error
 */

// POST a new order 
router.post("/", authenticateToken, async (req, res) => {
    try {
        const newOrder = new Order(req.body); 
        const savedOrder = await newOrder.save(); 
        res.status(201).json(savedOrder); 
    } catch (error) {
        // If there is an error
        res.status(400).json({ message: error.message });
    }
});

// PUT

/**
 * @swagger
 * /orders/{OrderNo}:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Update an Order
 *     description: Completely updates an existing order with provided data.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: OrderNo
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the order to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *           example:
 *             OrderNo: 2468
 *             CustNo: 101
 *             Order Date: "17/06/202"
 *             Product Code: 546
 *             Product Name: "Test Put"
 *             Product Quantity: 40
 *             Product Price: 3
 *             Total: 120
 *             ModeOf Payment: "Credit Card"
 *     responses:
 *       200:
 *         description: Order Updated.
 *       404:
 *         description: Order not found.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Server error
 */


// PUT to update an order
router.put("/:OrderNo", authenticateToken, async (req, res) => {
    const orderNo = parseInt(req.params.OrderNo);
    const orderUpdates = req.body;

    // List of all required fields
    const requiredFields = [
        'OrderNo', 'CustNo', 'Order Date', 'Product Code', 
        'Product Name', 'Product Quantity', 'Product Price', 
        'Total', 'ModeOf Payment'
    ];

    const missingFields = requiredFields.filter(field => orderUpdates[field] === undefined);

    // If any required fields are missing
    if (missingFields.length > 0) {
        return res.status(400).json({ message: "Missing required fields:   " + missingFields.join("?    ") });
    }
    
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { OrderNo: orderNo },
            { $set: orderUpdates },
            { new: false, runValidators: true }  // Option to not return the new document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({
            message: "Order updated successfully",
            Original_Order: updatedOrder, 
            Updated_Order: orderUpdates 
        });
    } catch (error) {
        console.error("Update error:", error); // Error
        res.status(500).json({ message: error.message });
    }
});

// PATCH

/**
 * @swagger
 * /orders/{OrderNo}:
 *   patch:
 *     tags:
 *       - Orders
 *     summary: Update a part of a Order
 *     description: Updates parts of an order based on the provided data.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: OrderNo
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the order to partially update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *           example:
 *             OrderNo: 1234
 *             CustNo: 010
 *             Product Code: 999
 *             Product Name: "Test Patch"
 *     responses:
 *       200:
 *         description: Order Updated.
 *       404:
 *         description: Order not found.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Server error
 */

// PATCH, updates a part of the order
router.patch("/:OrderNo", authenticateToken, async (req, res) => {
    const orderNo = parseInt(req.params.OrderNo);

    try {
        const originalOrder = await Order.findOne({ OrderNo: orderNo });

        if (!originalOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        const updateResult = await Order.findOneAndUpdate(
            { OrderNo: orderNo },
            { $set: req.body },
            { new: true }  
        );

        if (!updateResult) {
            return res.status(404).json({ message: "Order not found after update" });
        }

        res.json({
            message: "Order updated successfully",
            Original_Order: originalOrder,
            Updated_Order: updateResult 
        });
    } catch (error) {
        console.error("Update error:", error); // Error
        res.status(500).json({ message: error.message });
    }
});

// DELETE

/**
 * @swagger
 * /orders/{OrderNo}:
 *   delete:
 *     tags:
 *       - Orders
 *     summary: Delete a Order
 *     description: Deletes a specific order based on the OrderNo provided.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: OrderNo
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the order to delete.
 *     responses:
 *       200:
 *         description: Order Deleted.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Server error
 */

// DELETE an order
router.delete("/:OrderNo", authenticateToken, async (req, res) => {
    const orderNo = parseInt(req.params.OrderNo);

    try {
        const result = await Order.deleteOne({ OrderNo: orderNo });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: `Failed to delete order (${error})` });
    }
});


module.exports = router; 
