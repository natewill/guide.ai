import OpenAI from "openai";
import { Buffer } from 'buffer';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';



const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export default async function processAudio(base64Audio: string) {
  try {

    // Convert base64 to Blob
    const audioBlob = base64ToBlob(base64Audio);

    // Convert Blob to File
    const audioFile = new File([audioBlob], "audio", { type: 'audio/wav' });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
  
    console.log(transcription.text);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-audio-preview", // Correct model name for chat-based completion (no audio support)
      modalities: ["text", "audio"],
      audio: { voice: "nova", format: "wav" },
      messages: [
        {
          role: "system",
          content: "You are travel guide in Paris, make sure to recommend local restaurants who's goal is to provide a user with information about the culture importance, history and trivia facts about the landmark in the picture, make it short and sweet, talk fast"
        },
        {
          role: "user",
          content: transcription.text
        }
      ]
    });

    if(response.choices[0].message.audio) {
      console.log(response.choices[0].message)
      const audioData = response.choices[0].message.audio?.data;
      const audioBlob = Buffer.from(audioData, 'base64');
      const base64AudioRet = audioBlob.toString('base64');
      return base64AudioRet;
    } else {
      console.error("No audio data in response");
    }
  } catch (error) {
    console.error("Error with OpenAI API:", error);
  }
}

const base64ToBlob = (base64: string): Blob => {
  const byteCharacters = atob(base64.split(',')[1]); // Split to remove the data URL part if present
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: 'audio/wav' });
};