
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeHealthReport = async (fileBase64: string, mimeType: string) => {
  const prompt = "Analyze this medical report. Extract key findings, identify any abnormal values, and provide a summary in professional but accessible language. Also, provide a health risk assessment score from 1-10 (1 being healthy).";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: fileBase64, mimeType: mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
          abnormalValues: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskScore: { type: Type.NUMBER },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "keyFindings", "riskScore"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getHealthAssistantResponse = async (query: string, history: {role: string, parts: any[]}[]) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are Medist AI, a global medical assistant. You help users understand their medical history and reports. Always emphasize that you are an AI assistant and they should consult doctors for final decisions. Use the context of the universal Medist ID which holds all their global data."
    }
  });

  const response = await chat.sendMessage({ message: query });
  return response.text;
};
