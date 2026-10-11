const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getAllTimetables,
  getTimetableByClass,
  createTimetableAdmin,
  updateTimetableAdmin,
  deleteTimetable,
} = require("../controllers/adminTimetableController");

router.use(
  protect,
  authorize(
    "Administrator",
    "Principal",
    "Vice Principal",
    "Sectional Head",
    "Grade Coordinator",
    "Admin",
    "admin"
  )
);

router.get("/", getAllTimetables);
router.get("/:classId", getTimetableByClass);
router.post("/", createTimetableAdmin);
router.put("/:classId", updateTimetableAdmin);
router.delete("/:classId", deleteTimetable);

module.exports = router;