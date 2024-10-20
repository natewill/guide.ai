import OpenAI from "openai";
import { Buffer } from 'buffer';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateSpeech(imageUrl: string): Promise<string> {
  console.log("Generating speech...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "You are travel guide who's goal is to provide a user with information about the culture importance, history and trivia facts about the landmark in the picture, make it short and sweet, talk fast" },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
  });

  const text = response.choices[0].message.content ?? "";
  console.log(text);

  // Convert text to speech using OpenAI API
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  const base64Audio = buffer.toString('base64');
  console.log(base64Audio);
  return base64Audio;
}