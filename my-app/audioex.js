import OpenAI from "openai";
import { writeFileSync } from "node:fs";
import fs from "fs";
const openai = new OpenAI();

// Fetch an audio file and convert it to a base64 string
const filePath = "/Users/natewilliams/Desktop/VT/codefest/Record.wav"
const fileBuffer = await fs.promises.readFile(filePath);  // Fix async issue
const base64str = fileBuffer.toString("base64");  // Convert to base64

try {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-audio-preview",  // Correct model name for chat-based completion (no audio support)
        modalities: ["text", "audio"],
        audio: { voice: "alloy", format: "wav" },
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "What is in this recording?" },
                    { type: "input_audio", input_audio: { data: base64str, format: "wav" } }
                ]
            }
        ]
    });

    // Save the response audio file if it exists (hypothetical)
    console.log(response.choices[0]);
    writeFileSync(
        "dog.wav",
        Buffer.from(response.choices[0].message.audio.data, 'base64'),
        { encoding: "utf-8" }
    );
} catch (error) {
    console.error("Error with OpenAI API:", error);
}