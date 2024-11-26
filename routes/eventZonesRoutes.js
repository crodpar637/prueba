// eventZonesRoutes.js
const express = require("express");
const router = express.Router();
const eventZonesController = require("../controllers/eventZonesController");

router.get("/event/:event_id", eventZonesController.getEventZonesByEventId);
router.get("/:event_zone_id", eventZonesController.getEventZoneDetails);


module.exports = router;
