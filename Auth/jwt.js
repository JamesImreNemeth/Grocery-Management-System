const jwt = require("jsonwebtoken");
const secretKey = "JamesSecretKey";

function generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: "4h" });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("decoded:", decoded);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
