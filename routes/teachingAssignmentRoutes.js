const express = require("express");
const router = express.Router();

const {
  assignTeacher,
  getAssignments,
  deleteAssignment,
} = require("../controllers/teachingAssignmentController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Admin only
router.post(
  "/",
  protect,
  authorize("Principal", "Vice Principal", "Sectional Head"),
  assignTeacher
);

router.get(
  "/",
  protect,
  authorize("Principal", "Vice Principal", "Sectional Head"),
  getAssignments
);

router.delete(
  "/:id",
  protect,
  authorize("Principal", "Vice Principal", "Sectional Head"),
  deleteAssignment
);

module.exports = router;