const express = require("express");
const router = express.Router();
const storeOwnerController = require("../controllers/storeOwnerController");
const { auth, authorize } = require("../middleware/auth");

// All routes require store owner authentication
router.use(auth, authorize("store_owner"));

// Dashboard
router.get("/dashboard", storeOwnerController.getDashboard);

module.exports = router;
