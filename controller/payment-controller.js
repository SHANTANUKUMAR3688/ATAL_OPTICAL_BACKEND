const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔹 Create Order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Verify Payment
exports.verifyPayment = (req, res) => {
   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  
  if (expectedSignature === razorpay_signature) {
    res.json({ success: true, message: "Payment Verified" });
  } else {
    res.status(400).json({ success: false, message: "Payment Failed" });
  }
};