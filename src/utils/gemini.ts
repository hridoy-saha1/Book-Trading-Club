import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
export const genAI = new GoogleGenerativeAI(apiKey);

export async function generateResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    console.log("Gemini raw result:", result); // 🔍 log full response

    let text = "";
    if (result.response) {
      if (typeof result.response.text === "string") {
        text = result.response.text;
      } else if (typeof result.response.text === "function") {
        text = result.response.text();
      }
    }

    return text || "Sorry, I couldn't process your request.";
  } catch (error) {
    console.error("Gemini error:", error); // 🔍 log the actual error
    return "Sorry, something went wrong.";
  }
}
