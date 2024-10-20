import OpenAI from "openai";
import path from "path";

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
              "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
            },
          },
        ],
      },
    ],
  });
  console.log(response.choices[0].message.content);

  const speechFile = path.resolve("./speech.mp3");


  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: response.choices[0].message.content,
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}
main();