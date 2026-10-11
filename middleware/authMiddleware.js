const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = user;

      next();
        console.log("Token:", token);
console.log("Decoded:", decoded);
console.log("User:", user);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "No token",
    });
  }

};

const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("User role:", req.user.role);
    console.log("Allowed roles:", roles);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
    console.log("User role:", req.user.role);
console.log("Allowed:", roles);
  };
};

module.exports = {
  protect,
  authorize,
};