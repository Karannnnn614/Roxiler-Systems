const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const { auth, authorize } = require("../middleware/auth");
const { ratingValidation, validate } = require("../middleware/validation");

// All routes require user authentication
router.use(auth, authorize("user"));

// Store listing and search
router.get("/", storeController.getAllStores);

// Rating submission
router.post(
  "/rating",
  ratingValidation.submit,
  validate,
  storeController.submitRating
);

module.exports = router;
