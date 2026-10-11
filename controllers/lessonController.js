const dayjs = require("dayjs");

const LessonRecord = require("../models/LessonRecord");
const Timetable = require("../models/Timetable");
const User = require("../models/User");

const categorySubjects = {
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


// Generate today's lesson record
const generateTodayRecord = async (req, res) => {
    try {

        const teacher = await User.findById(req.user._id);

        if (!teacher.classId) {
            return res.status(400).json({
                success: false,
                message: "No class assigned."
            });
        }

        const today = dayjs();
        const date = today.startOf("day").toDate();
        // const day = today.format("dddd");
        const day = "Monday"; // Testing only

        

        if (["Saturday", "Sunday"].includes(day)) {
            return res.status(400).json({
                success: false,
                message: "No school today."
            });
        }

        const existing = await LessonRecord.findOne({
            classId: teacher.classId,
            date,
        });

        if (existing) {
            return res.json({
                success: true,
                data: existing,
            });
        }

        const timetable = await Timetable.findOne({
            classId: teacher.classId,
        });

        if (!timetable) {
            return res.status(404).json({
                success: false,
                message: "Timetable not found."
            });
        }

const todayPeriods = timetable[day];

if (!todayPeriods) {
    return res.status(400).json({
        success: false,
        message: `No timetable found for ${day}`
    });
}

const periods = todayPeriods.map((period) => {

  if (
    ["Religion", "Aesthetic", "Language"].includes(period.category)
  ) {

return {
  period: period.period,
  category: period.category,
  isCategory: true,
  subject: null,

  subjects: categorySubjects[period.category].map((subject) => ({
    subject,
    lessonDone: false,
    reliefDone: false,
  })),
};

  }

  return {
    period: period.period,
    category: period.category,
    subject: period.subject,

    subjects: [],

    lessonDone: false,
    reliefDone: false,
  };

});

        const lessonRecord = await LessonRecord.create({
            classId: teacher.classId,
            date,
            day,
            periods,
        });

        res.status(201).json({
            success: true,
            data: lessonRecord,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get today's lesson record
const getTodayRecord = async (req, res) => {

    try {

        const teacher = await User.findById(req.user._id);

        const date = dayjs().startOf("day").toDate();

        const record = await LessonRecord.findOne({
            classId: teacher.classId,
            date,
        });

        // if (!record) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Today's record not found."
        //     });
        // }
        if (!record) {
    const timetable = await Timetable.findOne({
        classId: teacher.classId,
    });

    if (!timetable) {
        return res.status(404).json({
            success: false,
            message: "Timetable not found."
        });
    }

// const day = new Date().toLocaleDateString("en-US", {
//   weekday: "long",
// });

const day = "Monday"; // Testing only

const periods = timetable[day].map((period) => {

  if (
    ["Religion", "Aesthetic", "Language"].includes(period.category)
  ) {

return {
  period: period.period,
  category: period.category,
  isCategory: true,
  subject: null,

  subjects: categorySubjects[period.category].map((subject) => ({
    subject,
    lessonDone: false,
    reliefDone: false,
  })),
};

  }

  return {
    period: period.period,
    category: period.category,
    subject: period.subject,

    subjects: [],

    lessonDone: false,
    reliefDone: false,
  };

});

    const newRecord = await LessonRecord.create({
        classId: teacher.classId,
        date,
        day,
        periods,
    });

    return res.json({
        success: true,
        data: newRecord,
    });
}

        res.json({
            success: true,
            data: record,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};


// Update lesson status
const updatePeriodStatus = async (req, res) => {
  try {
    const {
      period,
      subject,
      lessonDone,
      reliefDone,
    } = req.body;

    const teacher = await User.findById(req.user._id);

    const date = dayjs().startOf("day").toDate();

    const record = await LessonRecord.findOne({
      classId: teacher.classId,
      date,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }

    const lesson = record.periods.find(
      (p) => p.period === Number(period)
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Period not found.",
      });
    }

    // ---------- CATEGORY SUBJECT ----------
if (
  ["Religion", "Aesthetic", "Language"].includes(
    lesson.category
  )
) {
      const sub = lesson.subjects.find(
        (s) => s.subject === subject
      );

      if (!sub) {
        return res.status(404).json({
          success: false,
          message: "Subject not found.",
        });
      }

      sub.lessonDone = lessonDone;
      sub.reliefDone = reliefDone;
    }

    // ---------- NORMAL SUBJECT ----------
    else {
      lesson.lessonDone = lessonDone;
      lesson.reliefDone = reliefDone;
    }

    await record.save();

    res.json({
      success: true,
      message: "Lesson updated.",
      data: record,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Get lesson history
const getLessonHistory = async (req, res) => {

    try {

        const teacher = await User.findById(req.user._id);

        const records = await LessonRecord.find({
            classId: teacher.classId,
        }).sort({
            date: -1,
        });

        res.json({
            success: true,
            count: records.length,
            data: records,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    generateTodayRecord,
    getTodayRecord,
    updatePeriodStatus,
    getLessonHistory,
};