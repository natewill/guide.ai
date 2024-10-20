import OpenAI from "openai";
import { writeFileSync } from "node:fs";
const openai = new OpenAI();

// Fetch an audio file and convert it to a base64 string
const url = "https://openaiassets.blob.core.windows.net/$web/API/docs/audio/alloy.wav";
const audioResponse = await fetch(url);
const buffer = await audioResponse.arrayBuffer();
const base64str = Buffer.from(buffer).toString("base64");

const response = await openai.chat.completions.create({
  model: "gpt-4o-audio-preview",
  modalities: ["text", "audio"],
  audio: { voice: "alloy", format: "wav" },
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What is in this recording?" },
        { type: "input_audio", input_audio: { data: base64str, format: "wav" }}
      ]
    }
  ]
});

writeFileSync(
    "dog.wav",
    Buffer.from(response.choices[0].message.audio.data, 'base64'),
    { encoding: "utf-8" }
  );