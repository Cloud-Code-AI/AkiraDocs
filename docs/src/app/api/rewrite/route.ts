import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { content, blockType, style } = await request.json();

    if (!content || !blockType || !style) {
      return NextResponse.json(
        { error: 'Missing required fields: content, blockType, or style' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that rewrites content while maintaining its original meaning and format."
        },
        {
          role: "user",
          content: `Rewrite the following ${blockType} content in a ${style} style:\n\n${content}`
        }
      ],
    });

    const rewrittenContent = completion.choices[0].message.content || '';

    return NextResponse.json({ content: rewrittenContent });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI content' },
      { status: 500 }
    );
  }
}