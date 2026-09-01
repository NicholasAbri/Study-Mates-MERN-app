const express = require("express");
const { body } = require("express-validator");

const {
  signUp,
  signIn,
  signOut,
  getProfile,
  updateProfile,
} = require("../controllers/AuthController");

const Authorization = require("../middleware/Authorization");

const router = express.Router();

router.post(
  "/sign-up",

  body("name").notEmpty().withMessage("Name must be filled"),

  body("email")
    .notEmpty()
    .withMessage("Email must be filled")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password must be filled")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  signUp,
);

router.post("/sign-in", signIn);

router.post("/logout", signOut);

// Profile

router.get("/profile", Authorization, getProfile);

router.patch("/profile", Authorization, updateProfile);

module.exports = router;
