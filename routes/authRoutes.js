const express = require("express");
const router = express.Router();

const {
  loginUser,
  createUser,
  getMyProfile,
  changePassword,
  getAllTeachers
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Public
router.post("/login", loginUser); 

// Private
router.get("/profile", protect, getMyProfile);

router.get("/teachers", getAllTeachers);

router.put("/change-password", protect, changePassword);

// Admin Only
router.post(
  "/create-user",
  protect,
  authorize(
    "Principal",
    "Vice Principal",
    "Admin"
  ),
  createUser
);

module.exports = router;