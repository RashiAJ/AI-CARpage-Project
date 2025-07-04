// app/api/get-survey/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { surveyResponses } from '@/lib/schema/survey';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const surveyId = params.id;

    if (!surveyId) {
      return NextResponse.json({ error: 'Survey ID is required.' }, { status: 400 });
    }

    // Fetch the specific survey response from the database using its ID
    const surveyData = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.id, surveyId))
      .limit(1);

    if (surveyData.length === 0) {
      return NextResponse.json({ error: 'Survey not found.' }, { status: 404 });
    }

    // Return the found survey data
    return NextResponse.json(surveyData[0]);

  } catch (error) {
    console.error('Error fetching survey response:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
