import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateEmpathyResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: `You are EmpathyBot, a warm, compassionate, and psychologically aware emotional wellness companion. 
        Your goal is to help users process their emotions, offer gentle encouragement, and suggest mindfulness techniques.
        Keep responses concise (under 100 words unless deeply necessary), conversational, and empathetic. 
        Use soothing language. Do not diagnose mental illnesses; instead, guide them to professional help if they seem in crisis.`,
        temperature: 0.7,
      },
      history: history, 
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I'm here for you. Could you tell me more about how you're feeling?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting right now, but please know that I'm here for you. Take a deep breath.";
  }
};
