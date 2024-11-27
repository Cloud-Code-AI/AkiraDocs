import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Define block-specific system prompts
const blockPrompts = {
  paragraph: {
    system: "You are an expert content editor. Maintain paragraph structure and formatting. Output only the rewritten paragraph text without any markdown or HTML.",
    format: "Plain text paragraph"
  },
  heading: {
    system: "You are a headline optimization expert. Create impactful, concise headings. Output only the heading text without any formatting.",
    format: "Single line heading text"
  },
  code: {
    system: "You are an expert code optimizer. Maintain the exact programming language syntax and structure. Output only valid code without any explanations.",
    format: "Valid code in the original language"
  },
  list: {
    system: "You are a list organization expert. Maintain the list structure with one item per line. Do not include bullets or numbers.",
    format: "One item per line, no bullets/numbers"
  },
  blockquote: {
    system: "You are a quote refinement expert. Maintain the quote's core message and emotional impact. Output only the quote text.",
    format: "Single quote text without quotation marks"
  },
  callout: {
    system: "You are a technical documentation expert. Maintain the callout's type (info/warning/success/error) and structure. Output only the callout content.",
    format: "Callout content preserving type indicators"
  },
  image: {
    system: "You are an image description expert. Optimize image alt text and captions. Output in JSON format with alt and caption fields.",
    format: '{ "alt": "...", "caption": "..." }'
  }
};

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

    const blockPrompt = blockPrompts[blockType as keyof typeof blockPrompts];
    if (!blockPrompt) {
      return NextResponse.json(
        { error: 'Invalid block type' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `${blockPrompt.system}\n\nExpected output format: ${blockPrompt.format}\n\nDo not include any explanations or markdown formatting in the response.`
        },
        {
          role: "user",
          content: `Rewrite the following ${blockType} content in a ${style} style while maintaining its structure:\n\n${content}`
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