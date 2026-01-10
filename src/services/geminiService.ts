import { GoogleGenAI } from "@google/genai";
import { Task, ClubEvent } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateEventDescription = async (title: string, date: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Please configure your environment.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a compelling, short (2 sentences) description for a Data Analytics Club event titled "${title}" happening on ${date}. Focus on learning and networking.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate description via AI.";
  }
};

export const generateTaskAnalysis = async (tasks: Task[], events: ClubEvent[]): Promise<string> => {
    if (!apiKey) return "API Key missing.";

    const taskSummary = tasks.map(t => `- ${t.title} (${t.status})`).join('\n');
    const prompt = `
      Analyze the following list of tasks for our Data Analytics Club events. 
      Provide a brief 3-bullet point executive summary on our operational efficiency and suggest one area of improvement.
      Keep it professional and encouraging.

      Tasks:
      ${taskSummary}
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "Analysis unavailable.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Failed to generate analysis.";
    }
};
