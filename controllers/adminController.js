const Class = require("../models/Class");
const LessonRecord = require("../models/LessonRecord");
const User = require("../models/User");
const { generateLessonReport } = require("../utils/pdfGenerator");
const dayjs = require("dayjs");

// Dashboard
const getDashboard = async (req, res) => {

    try {

        const totalClasses = await Class.countDocuments({
            isActive: true
        });

        const totalTeachers = await User.countDocuments({
            role: "Class Teacher",
            isActive: true
        });

        const today = dayjs().startOf("day").toDate();

        const submittedToday = await LessonRecord.countDocuments({
            date: today
        });

        res.json({
            success: true,
            data: {
                totalClasses,
                totalTeachers,
                submittedToday,
                pendingClasses: totalClasses - submittedToday
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// View lesson record by class and date
const getLessonByClassAndDate = async (req, res) => {

    try {

        const { classId, date } = req.query;

        const record = await LessonRecord.findOne({
            classId,
            date: dayjs(date).startOf("day").toDate()
        }).populate("classId");

        if (!record) {

            return res.status(404).json({
                success: false,
                message: "Record not found."
            });

        }

        res.json({
            success: true,
            data: record
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// Classes that haven't submitted today
const getPendingClasses = async (req, res) => {

    try {

        const today = dayjs().startOf("day").toDate();

        const records = await LessonRecord.find({
            date: today
        });

        const submitted = records.map(r => r.classId.toString());

        const pending = await Class.find({
            isActive: true,
            _id: { $nin: submitted }
        });

        res.json({
            success: true,
            count: pending.length,
            data: pending
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const exportLessonPDF = async (req, res) => {
  try {

    const { classId, date } = req.query;

    const lesson = await LessonRecord.findOne({
      classId,
      date,
    }).populate("classId");

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson record not found.",
      });
    }

    generateLessonReport(lesson, res);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTodayOverview = async (req, res) => {
  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await LessonRecord.find({
      date: today,
    }).populate("classId");

    const result = records.map((record) => ({
      classId: record.classId?._id,
      className: record.classId
        ? `Grade ${record.classId.grade}${record.classId.section}`
        : "Unknown",
      day: record.day,
      periods: record.periods,
    }));

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
    getDashboard,
    getLessonByClassAndDate,
    getPendingClasses,
    exportLessonPDF,
    getTodayOverview
};