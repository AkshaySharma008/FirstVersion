const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ verify: (req, res, buf) => (req.rawBody = buf) }));

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong from backend!" });
});

// 1) Create Order
app.post("/api/create-order", async (req, res) => {
  const { amountInPaise, receipt, notes } = req.body;
  console.log(req.body);

  try {
    const order = await razor.orders.create({
      amount: amountInPaise, // e.g., 5000 = ₹50.00
      currency: "INR",
      receipt,
      notes,
    });

    console.log("order", order);
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 2) Webhook (source of truth)
app.post("/api/razorpay/webhook", (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest("hex");

  if (signature !== expected) return res.status(400).send("Invalid signature");

  const event = req.body.event;
  const payload = req.body.payload;

  // Handle events like payment.captured / order.paid
  // Update your DB: set payment status "success" for order_id = payload.payment?.entity?.order_id
  // Then notify app (WebSocket/Push/Poll)
  res.json({ status: "ok" });
});

// 3) Optional server-side signature verification (if you use Checkout handler)
app.post("/api/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  const valid = expected === razorpay_signature;
  res.json({ valid });
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
