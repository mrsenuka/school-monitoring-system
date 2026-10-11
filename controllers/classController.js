const Class = require("../models/Class");
const User = require("../models/User");

// Create a new class
const createClass = async (req, res) => {
  try {
    const { grade, section } = req.body;

    const className = `${grade}${section.toUpperCase()}`;

    const existing = await Class.findOne({ className });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Class already exists",
      });
    }

    const newClass = await Class.create({
      grade,
      section: section.toUpperCase(),
      className,
    });

    res.status(201).json({
      success: true,
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all active classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({ isActive: true })
      .populate("classTeacher", "fullName username");

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get class by ID
const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("classTeacher", "fullName username");

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update class
const updateClass = async (req, res) => {
  try {
    const { grade, section } = req.body;

    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    classData.grade = grade;
    classData.section = section.toUpperCase();
    classData.className = `${grade}${section.toUpperCase()}`;

    await classData.save();

    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Soft delete class
const deleteClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    classData.isActive = false;
    await classData.save();

    res.status(200).json({
      success: true,
      message: "Class deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Assign class teacher
const assignClassTeacher = async (req, res) => {
  try {
    const { classId, teacherId } = req.body;

    const classData = await Class.findById(classId);
    const teacher = await User.findById(teacherId);

    if (!classData || !teacher) {
      return res.status(404).json({
        success: false,
        message: "Class or Teacher not found",
      });
    }

    if (teacher.role !== "Class Teacher") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a Class Teacher",
      });
    }

    classData.classTeacher = teacher._id;
    teacher.classId = classData._id;

    await classData.save();
    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Class teacher assigned successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignClassTeacher,
};