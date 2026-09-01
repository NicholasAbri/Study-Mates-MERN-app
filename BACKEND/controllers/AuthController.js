const { validationResult } = require("express-validator");
const AuthModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// =========================
// SIGN UP
// =========================

const signUp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
    });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await AuthModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 9);

    const user = await AuthModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    return res.status(201).json({
      message: "Account created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    return res.status(500).json({
      message: "Failed to create user account",
      error: error.message,
    });
  }
};

// =========================
// SIGN IN
// =========================

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AuthModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Email and password combination is incorrect",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    return res.status(200).json({
      message: "User signed in successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("SIGNIN ERROR:", error);

    return res.status(500).json({
      message: "Failed to sign in",
      error: error.message,
    });
  }
};

// =========================
// SIGN OUT
// =========================

const signOut = (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({
    message: "User logged out successfully",
  });
};

// =========================
// GET PROFILE
// =========================

const getProfile = async (req, res) => {
  try {
    const user = await AuthModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// =========================
// UPDATE PROFILE
// =========================

const updateProfile = async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  try {
    const updatedUser = await AuthModel.findByIdAndUpdate(
      req.user.id,
      {
        name: name.trim(),
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  getProfile,
  updateProfile,
};
