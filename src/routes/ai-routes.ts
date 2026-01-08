import { Router, Request, Response } from "express";
import { Product } from "../model/Product";
import { askGemini } from "../model/gemini";

const router = Router();

const greetingKeywords = [
  "hi",
  "hello",
  "hey",
  "how are you",
  "good morning",
  "good evening",
  "good afternoon",
  "what's up",
  "whats up",
  "sup",
  "yo",
];

function isGreeting(message: string) {
  const text = message.toLowerCase().trim();
  return greetingKeywords.some((k) => text.includes(k));
}

function getGreetingReply() {
  const replies = [
    "Hello! 😊 How can I help you today?",
    "Hi there! 👋 What can I do for you?",
    "Hey! 😄 Need any assistance?",
    "Hello friend! 💬 How can I support you today?",
    "Hi! I'm here to help. Ask me anything!",
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

const shippingInfo = {
  Asia: { days: 5, fee: "$10" },
  Europe: { days: 10, fee: "$20" },
  "North America": { days: 7, fee: "$15" },
  "South America": { days: 12, fee: "$25" },
  Africa: { days: 14, fee: "$30" },
  Oceania: { days: 8, fee: "$20" },
};

const freeShippingThreshold = 1000;

router.post("/ask", async (req: Request, res: Response) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question is required" });

  try {
    const q = question.toLowerCase();
    let results: any[] = [];
    let context: any = {};

    if (isGreeting(question)) {
      return res.json({ answer: getGreetingReply(), results: [] });
    }

    const isProductQuestion =
      q.includes("product") ||
      q.includes("price") ||
      q.includes("stock") ||
      q.includes("category") ||
      q.includes("business");

    const isShippingQuestion = q.includes("shipping") || q.includes("delivery");
    const isFreeShippingQuestion = q.includes("free shipping");
    const isCustomizationQuestion =
      q.includes("customization") ||
      q.includes("custom mode") ||
      q.includes("customize");

    const isAccountQuestion =
      q.includes("create account") ||
      q.includes("how to sign up") ||
      q.includes("register") ||
      q.includes("how to create account");

    if (isCustomizationQuestion) {
      return res.json({
        answer:
          "Sorry, the customization mode is still under development. You will be able to use it soon!",
        results: [],
      });
    }

    if (isFreeShippingQuestion) {
      return res.json({
        answer: `Shipping is not free for any region by default. However, if you purchase products worth more than $${freeShippingThreshold}, shipping will be free.`,
        results: [],
      });
    }

    if (isAccountQuestion) {
      return res.json({
        answer:
          "Here’s how you can create an account on our website. Follow the steps shown in this video:",
        video: "https://www.youtube.com/embed/qIFyonxTuY0?si=ityW9Rf9ry7u3K9j",
        results: [],
      });
    }

    if (isProductQuestion) {
      const projection = {
        name: 1,
        description: 1,
        category: 1,
        price: 1,
        discountPrice: 1,
        stock: 1,
        images: 1,
        _id: 0,
      };

      if (q.includes("lowest price") || q.includes("cheapest")) {
        results = await Product.find({}, projection).sort({ price: 1 }).limit(1);
      } else if (q.includes("highest price") || q.includes("most expensive")) {
        results = await Product.find({}, projection).sort({ price: -1 }).limit(1);
      } else if (q.includes("under") || q.includes("below")) {
        const extracted = q.match(/\d+/);
        if (extracted) {
          const maxPrice = Number(extracted[0]);
          results = await Product.find({ price: { $lt: maxPrice } }, projection).sort({
            price: 1,
          });
        }
      } else {
        results = await Product.find({}, projection).limit(5);
      }

      context = { products: results };
    }

    if (isShippingQuestion && !isFreeShippingQuestion) {
      context = { shipping: shippingInfo };
    }

    if (
      !isProductQuestion &&
      !isShippingQuestion &&
      !isCustomizationQuestion &&
      !isFreeShippingQuestion &&
      !isAccountQuestion
    ) {
      return res.json({
        answer: "Sorry, this question is not related to our business or products.",
        results: [],
      });
    }

    const answer = await askGemini(
      `User Question: ${question}\nDatabase Results: ${JSON.stringify(context)}`
    );

    res.json({
      answer,
      results: results,
      shipping: isShippingQuestion ? shippingInfo : undefined,
    });
  } catch (error: any) {
    console.error("Error in /ask:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
