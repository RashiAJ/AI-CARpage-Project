// app/api/dify-questions/route.ts
import { NextResponse } from 'next/server';

// This represents the structure we expect inside Dify's JSON response
interface DifyQuestion {
  text: string;
  type: 'multiple-choice';
  options: string[];
}

export async function POST(request: Request) {
  const { category } = await request.json();

  if (!category) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 });
  }

  const apiKey = process.env.DIFY_API_KEY;
  const apiUrl = 'https://api.dify.ai/v1/chat-messages';

  if (!apiKey) {
    console.error('Dify API key is not configured on the server.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // A detailed prompt to guide the LLM to return a clean JSON response.
  const prompt = `Generate 10 multiple choice questions for the category: "${category}". The response must be a valid JSON object containing a single key "questions". This key should hold an array of question objects. Each object must have three keys: "text" (the question string), "type" (the string "multiple-choice"), and "options" (an array of 4 unique string options). Do not include any text outside of the JSON object.`;

  try {
    const difyResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { category }, // Correctly pass the category in the 'inputs' object
        query: prompt, // The query still guides the AI to produce JSON
        user: 'survey-user-toyota-backend',
        response_mode: 'blocking',
      }),
    });

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text();
      console.error('Dify API Error:', errorText);
      return NextResponse.json({ error: `Failed to fetch from Dify: ${errorText}` }, { status: difyResponse.status });
    }

    const data = await difyResponse.json();
    const answer = data.answer;

    if (!answer) {
      return NextResponse.json({ error: "Dify response did not contain an 'answer' field." }, { status: 500 });
    }

    // The 'answer' from Dify is expected to be a string containing JSON.
    // We need to find the JSON block and parse it.
    const jsonString = answer.substring(answer.indexOf('{'), answer.lastIndexOf('}') + 1);
    const jsonResponse = JSON.parse(jsonString);
    const generatedQuestions: DifyQuestion[] = jsonResponse.questions || [];

    // Return the successfully parsed questions to the frontend
    return NextResponse.json({ questions: generatedQuestions });

  } catch (error) {
    console.error('Error in dify-questions API route:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Failed to parse Dify\'s response. Not valid JSON.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
