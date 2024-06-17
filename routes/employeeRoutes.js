const express = require("express");
const Employees = require("../models/employee");
const { generateToken } = require("../Auth/jwt");

const router = express.Router();

// Swagger

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - Username
 *         - Password
 *       properties:
 *         Username:
 *           type: string
 *           description: The user's username
 *         Password:
 *           type: string
 *           description: The user's password
 *       example:
 *         Username: Luc43
 *         Password: Axgp231@!
 */

/**
 * @swagger
 * /employees/login:
 *   post:
 *     summary: Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid username or password
 *       400:
 *         description: Bad request
 */

router.post("/login", async (req, res) => {
  try {
    const { Username, Password } = req.body;
    const employee = await Employees.findOne({ Username });
    if (!employee) {
      return res.status(401).json({ message: "No username found" });
    }
    const isMatch = Password === employee.Password;
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid user ID or Password" });
    }
    const token = generateToken({ Username: employee.Username });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;
