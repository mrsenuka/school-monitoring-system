const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
user: {
  id: user._id,
  fullName: user.fullName,
  username: user.username,
  role: user.role,
  className: user.className,
  classId: user.classId,
  firstLogin: user.firstLogin,
},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create User
// @route   POST /api/auth/create-user
// @access  Admin
const createUser = async (req, res) => {
  try {
const {
  fullName,
  username,
  password,
  role,
  className,
  classId
} = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

const user = await User.create({
  fullName,
  username,
  password,
  role,
  className: role === "Class Teacher" ? className : null,
  classId: role === "Class Teacher" ? classId : null,
});

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get Logged In User
// @route   GET /api/auth/profile
// @access  Private
const getMyProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all Class Teachers
// @route   GET /api/users/teachers
// @access  Admin

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({
      role: "Class Teacher",
      isActive: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  loginUser,
  createUser,
  getMyProfile,
  changePassword,
  getAllTeachers
};