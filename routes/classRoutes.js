const express = require("express");
const router = express.Router();

const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignClassTeacher,
} = require("../controllers/classController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// View all classes
router.get(
  "/",
  protect,
  authorize(
    "Principal",
    "Vice Principal",
    "Sectional Head",
    "Grade Coordinator",
    "Admin"
  ),
  getAllClasses
);

// Assign class teacher
router.put(
  "/assign-teacher",
  protect,
  authorize("Principal", "Vice Principal","Admin"),
  assignClassTeacher
);


// View one class
router.get(
  "/:id",
  protect,
  authorize(
    "Principal",
    "Vice Principal",
    "Sectional Head",
    "Grade Coordinator",
    "Admin"
  ),
  getClassById
);

// Create class
router.post(
  "/",
  protect,
  authorize("Principal", "Vice Principal","Admin"),
  createClass
);

// Update class
router.put(
  "/:id",
  protect,
  authorize("Principal", "Vice Principal","Admin"),
  updateClass
);

// Soft delete class
router.delete(
  "/:id",
  protect,
  authorize("Principal","Admin"),
  deleteClass
);
module.exports = router;