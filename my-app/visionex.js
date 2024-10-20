import OpenAI from "openai";
import path from "path";
import fs from "fs";


const openai = new OpenAI();

async function main() {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "You are travel guide who's goal is to provide a user with information about the culture importance, history and trivia facts about the landmark in the picture" },
          {
            type: "image_url",
            image_url: {
              "url": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Palacio_Real%2C_%C3%81msterdam%2C_Pa%C3%ADses_Bajos%2C_2016-05-30%2C_DD_07-09_HDR.jpg",
            },
          },
        ],
      },
    ],
  });


  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: response.choices[0].message.content,
  });
  
  const speechFile = path.resolve("./speech.mp3");
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);

}
main();