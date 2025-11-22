import { GoogleGenAI } from "@google/genai";
import { CountryData } from "../types";

const getClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const fetchEconomicAnalysis = async (countryName: string, gdpData: CountryData | null): Promise<string> => {
  const ai = getClient();
  
  const context = gdpData 
    ? `Known data: GDP ~${gdpData.gdp}B USD, Growth: ${gdpData.gdpGrowth}%.` 
    : "Data not locally available, please estimate.";

  const prompt = `
    Generate a concise, real-time style economic summary for ${countryName}. 
    ${context}
    Focus on:
    1. Key economic drivers in 2024/2025.
    2. Recent major events affecting their economy.
    3. Future outlook (Positive/Negative).
    
    Format using Markdown. Keep it under 200 words. Use bullet points for readability.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class senior economist providing brief, high-level executive summaries for a global dashboard.",
        temperature: 0.7,
      }
    });
    
    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to retrieve AI analysis at this time.";
  }
};

export const streamChatResponse = async function* (history: {role: string, parts: {text: string}[]}[], newMessage: string) {
    const ai = getClient();
    
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
             systemInstruction: "You are an AI assistant integrated into a Global GDP dashboard. Answer questions about global economics, specific country stats, and comparisons concisely.",
        }
    });

    const result = await chat.sendMessageStream({ message: newMessage });
    
    for await (const chunk of result) {
        yield chunk.text;
    }
}