const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

connectDB();

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("Principal account already exists.");
      process.exit();
    }

    await User.create({
      fullName: "System Administrator",
      username: "admin",
      password: "Admin@123",
      role: "Principal",
      isActive: true,
      firstLogin: false,
    });

    console.log("Principal account created successfully!");
    console.log("Username: admin");
    console.log("Password: Admin@123");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();