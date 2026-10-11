const express = require("express");
const router = express.Router();

console.log("ADMIN ROUTES LOADED");

const {
  getDashboard,
  getLessonByClassAndDate,
  getPendingClasses,
  exportLessonPDF,
  getTodayOverview
} = require("../controllers/adminController");


const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// All admin roles
router.use(
  protect,
  authorize(
    "Principal",
    "Vice Principal",
    "Sectional Head",
    "Grade Coordinator",
    "Admin"
  )
);


// Dashboard statistics
router.get("/dashboard", getDashboard);

// View a lesson record by class and date
// Example: /api/admin/lesson?classId=123&date=2026-10-09
router.get("/lesson", getLessonByClassAndDate);

// Classes that haven't submitted today's lesson record
router.get("/pending", getPendingClasses);

router.get("/export-pdf", exportLessonPDF);

router.get(
  "/today-overview",
  protect,
  (req, res, next) => {
    console.log("Role:", req.user.role);
    next();
  },
  getTodayOverview
);

module.exports = router;