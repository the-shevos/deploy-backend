import express from "express";
import Stripe from "stripe";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

router.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body; 

  if (!amount) return res.status(400).send({ error: "Amount is required" });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
});

export default router;
