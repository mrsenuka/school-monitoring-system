const express = require("express");
const router = express.Router();

const {
  generateTodayRecord,
  getTodayRecord,
  updatePeriodStatus,
  getLessonHistory,
} = require("../controllers/lessonController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Class Teacher Routes

// Generate today's lesson record (first time only)
router.post(
  "/today",
  protect,
  authorize("Class Teacher"),
  generateTodayRecord
);

// Get today's lesson record
router.get(
  "/today",
  protect,
  authorize("Class Teacher"),
  getTodayRecord
);

// Update lesson / relief status
router.put(
  "/today",
  protect,
  authorize("Class Teacher"),
  updatePeriodStatus
);

// View lesson history
router.get(
  "/history",
  protect,
  authorize("Class Teacher"),
  getLessonHistory
);

module.exports = router;