// pages/api/openai.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { gpt_template } from "./gpt_template";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your .env.local file
});

export async function GET() {
  return new Response("GET Request not supported", {
    status: 200,
  });
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    //Make a copy of the template
    const gpt_request = JSON.parse(JSON.stringify(gpt_template));

    //Update the user message
    gpt_request.messages.push({
      role: "user",
      content: [{ type: "text", text: message }],
    });

    const completion = await openai.chat.completions.create(gpt_request);

    const responseText =
      completion.choices[0]?.message?.content ||
      "No response from Lyric Generator";

    return NextResponse.json({ lyrics: responseText }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to communicate with Lyric Generator: " + error },
      { status: 500 }
    );
  }
}
