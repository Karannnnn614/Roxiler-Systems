const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { userValidation, validate } = require("../middleware/validation");
const { auth } = require("../middleware/auth");

// Public routes
router.post("/signup", userValidation.signup, validate, authController.signup);
router.post("/login", userValidation.login, validate, authController.login);

// Protected routes
router.put(
  "/update-password",
  auth,
  userValidation.updatePassword,
  validate,
  authController.updatePassword
);

module.exports = router;
