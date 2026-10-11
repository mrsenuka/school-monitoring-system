const express = require("express");
const router = express.Router();

const {
  createTimetable,
  getMyTimetable,
  updateTimetable,
  getTodayTimetable,
} = require("../controllers/timetableController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Class Teacher only
router.post(
  "/",
  protect,
  authorize("Class Teacher"),
  createTimetable
);

router.get(
  "/",
  protect,
  authorize("Class Teacher"),
  getMyTimetable
);

router.put(
  "/",
  protect,
  authorize("Class Teacher"),
  updateTimetable
);

router.get(
  "/today",
  protect,
  authorize("Class Teacher"),
  getTodayTimetable
);

module.exports = router;