// seatRoutes.js
const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seatController");

router.get("/:event_zone_id", seatController.getSeatsByEventZoneId);

module.exports = router;
