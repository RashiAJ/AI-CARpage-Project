// app/api/save-survey/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Import our new centralized db instance
import { surveyResponses } from '@/lib/schema/survey'; // Import the survey schema
import { chat, message as messageSchema } from '@/lib/db/schema';
import { auth } from '@/app/(auth)/auth'; // Import auth for user session

export async function POST(request: Request) {
  try {
    const { category, questions, answers } = await request.json();

    // Basic validation to ensure all required data is present
    if (!category || !questions || !answers) {
      return NextResponse.json({ error: 'Missing required survey data.' }, { status: 400 });
    }

    // Insert the survey data into the database and return the new record's ID.
    // Drizzle's `returning()` method is efficient for getting the ID back.
    const newSurveyResponse = await db
      .insert(surveyResponses)
      .values({
        category,
        questions,
        answers,
      })
      .returning({ id: surveyResponses.id });

    const surveyId = newSurveyResponse[0]?.id;

    if (!surveyId) {
      throw new Error('Failed to create survey response in the database.');
    }

    // Create a new chat associated with this survey
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
    }

    const newChat = await db
      .insert(chat)
      .values({
        title: `Survey: ${category}`,
        userId: session.user.id,
        createdAt: new Date(),
      })
      .returning({ id: chat.id });

    const chatId = newChat[0]?.id;

    if (!chatId) {
      throw new Error('Failed to create a new chat session.');
    }

    // Create the initial message from the survey responses
    const initialMessageContent = `Based on my survey responses for the "${category}" category, here are my answers:\n\n${Object.entries(answers).map(([qIndex, answer]) => `- ${questions[parseInt(qIndex, 10)].question}: ${answer}`).join('\n')}\n\nPlease provide recommendations based on this.`;

    await db.insert(messageSchema).values({
      chatId,
      role: 'user',
      parts: [{ type: 'text', text: initialMessageContent }],
      attachments: [],
      createdAt: new Date(),
    });

    // Return both chatId and surveyId to the frontend
    return NextResponse.json({ 
      chatId,
      surveyId
    });

  } catch (error) {
    console.error('Error saving survey response:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
