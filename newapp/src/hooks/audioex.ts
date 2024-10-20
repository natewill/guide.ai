import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export default async function processAudio(base64Audio: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-audio-preview", // Correct model name for chat-based completion (no audio support)
      modalities: ["text", "audio"],
      audio: { voice: "nova", format: "wav" },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What is in this recording?" },
            { type: "input_audio", input_audio: { data: base64Audio, format: "wav" } }
          ]
        }
      ]
    });

    // Handle the response audio file if it exists (hypothetical)
    if (response.choices && response.choices[0] && response.choices[0].message.audio) {
      console.log(response.choices[0]);
      const audioData = response.choices[0].message.audio.data;
      const audioBlob = new Blob([Buffer.from(audioData, 'base64')], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      // You can now use the audioUrl to play the audio or save it using FileSaver.js
      console.log("Audio URL:", audioUrl);
    } else {
      console.error("No audio data in response.");
    }
  } catch (error) {
    console.error("Error with OpenAI API:", error);
  }
}