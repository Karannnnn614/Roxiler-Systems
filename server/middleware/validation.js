const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

const userValidation = {
  signup: [
    body("name")
      .trim()
      .isLength({ min: 20, max: 60 })
      .withMessage("Name must be between 20 and 60 characters"),
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be between 8 and 16 characters")
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage(
        "Password must contain at least one uppercase letter and one special character"
      ),
    body("address")
      .trim()
      .isLength({ max: 400 })
      .withMessage("Address must not exceed 400 characters")
      .notEmpty()
      .withMessage("Address is required"),
  ],

  login: [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  updatePassword: [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8, max: 16 })
      .withMessage("New password must be between 8 and 16 characters")
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage(
        "New password must contain at least one uppercase letter and one special character"
      ),
  ],
};

const storeValidation = {
  create: [
    body("name")
      .trim()
      .isLength({ min: 20, max: 60 })
      .withMessage("Store name must be between 20 and 60 characters"),
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),
    body("address")
      .trim()
      .isLength({ max: 400 })
      .withMessage("Address must not exceed 400 characters")
      .notEmpty()
      .withMessage("Address is required"),
  ],
};

const ratingValidation = {
  submit: [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
  ],
};

module.exports = {
  validate,
  userValidation,
  storeValidation,
  ratingValidation,
};
