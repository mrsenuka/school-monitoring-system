require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const teachingAssignmentRoutes = require("./routes/teachingAssignmentRoutes");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminTimetableRoutes = require('./routes/adminTimetableRoutes')

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School Monitoring System API is running.",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/timetables", adminTimetableRoutes);
app.use("/api/teaching-assignments", teachingAssignmentRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});