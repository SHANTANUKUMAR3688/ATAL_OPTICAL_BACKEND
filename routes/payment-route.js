const express = require("express");
const router = express.Router();
const {createOrder,verifyPayment,} = require("../controller/payment-controller");

router.post("/payment/create-order", createOrder);
router.post("/payment/verify-payment", verifyPayment);

module.exports = router;