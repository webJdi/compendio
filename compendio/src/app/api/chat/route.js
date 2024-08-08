import { NextResponse } from "next/server";
import OpenAI from 'openai';

const systemPrompt = 'You are an '

export async function POST(req)
{
    const openai = new OpenAI(
        {
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: "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",
            
          }
    )
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages:[
            {
                role:'system',
                content:systemPrompt,
            },
            ...data,
        ],
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(Controller)
        {
            const encoder = new TextEncoder()
            try{
                for await(const chunk of completion)
                {
                    const content = chunk.choices[0]?.delta?.content
                    if(content)
                    {
                        const text = encoder.encode(content)
                        controller.enqueue(text)

                    }
                }
            }
            catch
            {
                controller.error(err)
            }
            finally
            {
                controller.close()
            }
        }
    })

    return new NextResponse(stream)
}