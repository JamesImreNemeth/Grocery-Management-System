const { verifyToken } = require("./jwt");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  const decoded = verifyToken(token);
  if (decoded) {
    req.user = decoded;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = authenticateToken;
