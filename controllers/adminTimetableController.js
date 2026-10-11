const Timetable = require("../models/Timetable");
const Class = require("../models/Class");

// GET all timetables
const getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find().populate(
      "classId",
      "grade section"
    );

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET timetable by class
const getTimetableByClass = async (req, res) => {
  try {
    const timetable = await Timetable.findOne({
      classId: req.params.classId,
    }).populate("classId", "grade section");

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    res.status(200).json({
      success: true,
      data: timetable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE timetable
const createTimetableAdmin = async (req, res) => {
  try {
    const {
      classId,
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
    } = req.body;

    const classExists = await Class.findById(classId);

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const existing = await Timetable.findOne({ classId });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Timetable already exists for this class",
      });
    }

    const timetable = await Timetable.create({
      classId,
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
    });

    res.status(201).json({
      success: true,
      message: "Timetable created successfully",
      data: timetable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE timetable
const updateTimetableAdmin = async (req, res) => {
  try {
    const timetable = await Timetable.findOneAndUpdate(
      { classId: req.params.classId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      data: timetable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE timetable
const deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findOneAndDelete({
      classId: req.params.classId,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Timetable deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllTimetables,
  getTimetableByClass,
  createTimetableAdmin,
  updateTimetableAdmin,
  deleteTimetable,
};