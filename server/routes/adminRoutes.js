const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { auth, authorize } = require("../middleware/auth");
const {
  userValidation,
  storeValidation,
  validate,
} = require("../middleware/validation");

// All routes require admin authentication
router.use(auth, authorize("admin"));

// Dashboard
router.get("/dashboard/stats", adminController.getDashboardStats);

// User Management
router.post(
  "/users",
  userValidation.signup,
  validate,
  adminController.createUser
);
router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserDetails);

// Store Management
router.post(
  "/stores",
  storeValidation.create,
  validate,
  adminController.createStore
);
router.get("/stores", adminController.getStores);

module.exports = router;
