const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: [
        "Class Teacher",
        "Grade Coordinator",
        "Sectional Head",
        "Vice Principal",
        "Principal",
      ],
      required: true,
    },

    className: {
      type: String,
      default: null, // Only for Class Teachers (e.g. "8E")
    },
    classId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Class",
  default: null,
},

    firstLogin: {
      type: Boolean,
      default: true,
    },
    isActive: {
  type: Boolean,
  default: true,
},
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema); 