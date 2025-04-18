// locationRoutes.js
const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

router.get("/", locationController.getAllLocation);
router.get("/:id", locationController.getLocationById);

module.exports = router;
