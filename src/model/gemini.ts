import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) throw new Error("GEMINI_API_KEY not set");

export const askGemini = async (promptText: string): Promise<string> => {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

  try {
    const response = await axios.post(url, {
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }]
        }
      ]
    });

    return (
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No answer"
    );
  } catch (error: any) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || error.message);
  }
};
