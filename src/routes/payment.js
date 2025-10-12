const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentcomtroller");

router.post("/vnpay/create", paymentController.createVNPayPayment);
router.get("/vnpay_return", paymentController.vnpayReturn);

module.exports = router;