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

export const chatWithQwalt = async (userMessage: string, conversationHistory: string): Promise<string> => {
  if (!apiKey) return "I'm having trouble connecting to my brain right now. Please make sure the Gemini API key is configured.";

  const systemContext = `You are Qwalt, the friendly AI assistant mascot of the Data Analytics Club (DAC) at St. Joseph's College of Engineering, Chennai. You are an owl character - wise, approachable, and enthusiastic about data analytics.

ABOUT THE CLUB:
- Full name: Data Analytics Club (DAC)
- College: St. Joseph's College of Engineering, Chennai
- Department: Artificial Intelligence and Data Science
- Focus: Data Analytics, AI, Machine Learning, SQL, Python, Power BI, and related technologies
- WhatsApp Group: https://chat.whatsapp.com/I8x1vrpqdnHFfym2ilUMg0

MENTORS:
- Dr. L. Sherly Annabel - Head of Department, PhD in Machine Learning
- Mrs. B. Arunmozhikalanchiam - Faculty Advisor, Assistant Professor, expert in Image Processing & ML
- Mr. Eneeyan Nanmaran - Industrial Expert & Corporate Trainer, expert in SQL, Python, ML, Power BI

CLUB LEADERSHIP:
- Kiruthik Kumar J - Founder (Final Year)
- Syed Aejaz Ahmed A - President (Pre-Final Year), Data Scientist specializing in ML & GenAI
- Marcben James Samuel S - Vice President (Second Year)
- NOWRIN BEGUM - Technical Lead (Pre-Final Year)
- Manoharesh S - Technical Co-Lead (Second Year)
- Angel Sini S A - Design Lead (Pre-Final Year)
- Naveen Kumar A - Co-Design Lead (Second Year)
- Vyas S - Event Coordinator (Second Year), AI/ML & React Developer
- Bhavadarshini R G - Outreach Coordinator (Pre-Final Year)
- Krissal K V - Dataset Manager (Second Year)
- Sri Sudharsanan K - Dataset Manager (Second Year)
- Dinesh Kalangiyam P - Social Media Lead (Second Year)
- Gavin N Benedict - Social Media Lead (Second Year)
- Srivardhni Palaniappan - Script Writer (Second Year)
- SHYLESH S - Script Writer (Second Year)

RECENT EVENTS:
- Query Quest (Feb 2, 2026) - Interactive DBMS & SQL Workshop and Quiz Competition at AV Hall

HOW TO JOIN:
- Students can join by reaching out through the club's WhatsApp group or contacting any team member
- Open to all years, especially 1st and 2nd year students interested in data analytics and AI

RULES FOR RESPONSES:
1. Keep responses concise (2-4 sentences max unless asked for detail)
2. Be friendly, enthusiastic, and use a warm tone
3. If asked something you don't know about the club, say you'll check with the team
4. You can use emojis occasionally to be friendly
5. Always encourage students to join the club and attend events
6. If asked about technical topics (Python, SQL, ML, etc.), give brief helpful answers and mention the club can help them learn more`;

  const prompt = `${systemContext}

Previous conversation:
${conversationHistory || '(New conversation)'}

User: ${userMessage}

Qwalt:`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Hmm, I'm not sure about that. Try asking me something about DAC!";
  } catch (error) {
    console.error("Qwalt Gemini Error:", error);
    return "Sorry, I'm having a moment! Please try again in a bit.";
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
