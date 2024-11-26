// seatRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get("/user/:user_id", paymentController.getPaymentsByUserId);
router.post("/", paymentController.createPayment);


module.exports = router;
