const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided", status: 401 });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    console.log("User authenticated", decoded);
    next();
  } catch (err) {
    console.error("Error verifying token", err);
    res.status(401).json({ message: "Unauthorized", status: 401 });
  }
};
module.exports = { authenticateToken };
