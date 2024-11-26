// ticketRoutes.js
const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");

router.get("/sold", ticketController.getTicketsSoldReport);
router.get("/:ticket_id", ticketController.getTicketByTicketId);


module.exports = router;