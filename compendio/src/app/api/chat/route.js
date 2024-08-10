import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = "You are the Headstarter Assistant Chatbot, designed to guide and support users by providing detailed information about the various projects completed during the Headstarter Fellowship. Your role is to offer insights into each project, including the objectives, technologies used, challenges faced, and key learnings. You can also assist with providing resources, tutorials, and examples related to these projects. Your goal is to ensure users gain a comprehensive understanding of the work accomplished during the fellowship and how it contributes to their learning journey.";

// The POST method to handle the incoming API request
export async function POST(req) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  try {
    const data = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...data.messages, 
      ],
      model: "meta-llama/llama-3.1-8b-instruct:free",
      stream: true, 
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text); 
            }
          }
        } catch (err) {
          controller.error(err); 
        } finally {
          controller.close(); 
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate a response" }),
      { status: 500 }
    );
  }
}
