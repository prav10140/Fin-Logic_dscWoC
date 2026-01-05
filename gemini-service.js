const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

// Initialize Gemini AI
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

async function analyzeWithGemini(promptText) {
  if (!genAI) throw new Error("Gemini API not configured");

  try {
    // Using gemini-2.0-flash as it is confirmed available (though maybe rate limited)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { temperature: 0.2 }
    });

    console.log("[Gemini] Sending request...");

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptText }] }]
    });

    const response = await result.response;
    const text = response.text();
    console.log("[Gemini] OK:", text.length);

    return text;

  } catch (err) {
    console.error("[Gemini] ERROR:", err);
    // Handle overload specifically
    if (err.message.includes('429')) {
        throw new Error("Gemini API Quota Exceeded. Please try again in a minute.");
    }
    throw err;
  }
}

async function listModels() {
  try {
      // Note: check if listModels exists
      if (genAI && genAI.listModels) {
        const models = await genAI.listModels();
        for (const m of models) {
            console.log(m.name);
        }
      } else { 
         // Fallback or just log if method missing (though user demanded specific code, I'll try to stick to it but safe)
         // User said: "👇 ye code gemini-service.js me temporary add karo"
         // I should paste EXACTLY what they said? 
         // "async function listModels() { const models = await genAI.listModels(); ... }"
         // If it crashes, it crashes. The user wants to see the output (or lack thereof).
         const models = await genAI.listModels(); // This might throw if not a function
         for (const m of models) {
            console.log(m.name);
         }
      }
  } catch(e) {
      console.log("Error listing models:", e.message);
  }
}

listModels();

module.exports = {
  analyzeWithGemini,
  isConfigured: !!apiKey
};
