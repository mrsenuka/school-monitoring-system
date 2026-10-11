const TeachingAssignment = require("../models/TeachingAssignment");
const User = require("../models/User");
const Class = require("../models/Class");

const validSubjects = {
  Religion: [
    "Buddhism",
    "Catholic",
    "Islam",
    "Hinduism",
  ],

  Aesthetic: [
    "Art",
    "Drama",
    "Dancing",
    "Eastern Music",
    "Western Music",
    "Carnatic Music",
  ],

  Language: [
    "Chinese",
    "Japanese",
    "French",
  ],
};

const assignTeacher = async (req, res) => {
  try {
    const {
      teacherId,
      classId,
      category,
      subject,
    } = req.body;

    const teacher = await User.findById(teacherId);
    const cls = await Class.findById(classId);

    if (!teacher || !cls) {
      return res.status(404).json({
        success: false,
        message: "Teacher or Class not found.",
      });
    }

    if (!validSubjects[category]) {
      return res.status(400).json({
        success: false,
        message: "Invalid category.",
      });
    }

    if (!validSubjects[category].includes(subject)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject.",
      });
    }

    const exists = await TeachingAssignment.findOne({
      teacher: teacherId,
      classId,
      category,
      subject,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Assignment already exists.",
      });
    }

    const assignment =
      await TeachingAssignment.create({
        teacher: teacherId,
        classId,
        category,
        subject,
      });

    res.status(201).json({
      success: true,
      data: assignment,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAssignments = async (req, res) => {
  try {
    const assignments = await TeachingAssignment.find()
      .populate("teacher", "fullName username")
      .populate("classId", "className")
      .sort({
        "classId.className": 1,
        category: 1,
        subject: 1,
      });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAssignment = async (req, res) => {
  try {

    await TeachingAssignment.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Assignment deleted.",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

module.exports = {
  assignTeacher,
  getAssignments,
  deleteAssignment,
};