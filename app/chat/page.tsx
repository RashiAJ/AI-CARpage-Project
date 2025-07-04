import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import type { Message } from '@ai-sdk/react';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { auth } from '../(auth)/auth';
import { db } from '@/lib/db';
import { surveyResponses } from '@/lib/schema/survey';

// Define the expected shape of the survey data from the DB to ensure type safety
interface SurveyData {
  id: string;
  category: string;
  // Assuming the 'questions' and 'answers' columns are JSONB
  questions: { question: string; options: string[] }[];
  answers: Record<number, string>;
  createdAt: Date;
}

/**
 * Generates a detailed, user-friendly prompt from the survey data.
 * @param survey The survey data fetched from the database.
 * @returns A string to be used as the initial message in the chat.
 */
const generatePromptFromSurvey = (survey: SurveyData): string => {
  const category = survey.category.toLowerCase();
  let prompt = '';
  
  // Common survey response header
  prompt += `Here are my responses to the ${survey.category} survey:\n\n`;
  
  // Format questions and answers
  survey.questions.forEach((mcq, index) => {
    const answer = survey.answers[index];
    if (answer) {
      prompt += `- **${mcq.question}**\n  - My Answer: ${answer}\n`;
    }
  });

  // Add category-specific instructions
  prompt += '\n';
  
  if (category.includes('recommendation') || category.includes('car')) {
    prompt += `Based on my responses, please recommend 5 specific Toyota models that would be the best fit for me. `;
    prompt += `For each recommendation, include:\n`;
    prompt += `1. Model name and variant\n`;
    prompt += `2. Key features that match my preferences\n`;
    prompt += `3. Price range and any available financing options\n`;
    prompt += `4. Why this model is a good fit for my needs\n`;
    prompt += `5. A link to book a test drive\n\n`;
    prompt += `Please format the recommendations in a clear, easy-to-read list with proper spacing between each model.`;
  } 
  else if (category.includes('maintenance')) {
    prompt += `Based on my vehicle and usage, please provide a detailed maintenance plan that includes:\n`;
    prompt += `1. Recommended service schedule (what needs to be done and when)\n`;
    prompt += `2. Estimated costs for each service\n`;
    prompt += `3. Warning signs to watch out for between services\n`;
    prompt += `4. DIY maintenance tips I can do at home\n`;
    prompt += `5. When to visit an authorized service center vs. a local mechanic\n\n`;
    prompt += `Please organize this information in a clear, structured format with sections for each type of maintenance.`;
  }
  else if (category.includes('parts') || category.includes('accessories')) {
    prompt += `Based on my vehicle and needs, please recommend relevant parts and accessories including:\n`;
    prompt += `1. Essential maintenance parts I should consider\n`;
    prompt += `2. Recommended upgrades or accessories that would enhance my driving experience\n`;
    prompt += `3. Genuine Toyota parts vs. aftermarket options with pros and cons\n`;
    prompt += `4. Estimated costs and where to purchase them\n`;
    prompt += `5. Installation difficulty level for each recommended item\n\n`;
    prompt += `Please organize this information in a clear, structured format.`;
  }
  else if (category.includes('resale') || category.includes('value')) {
    prompt += `Based on my vehicle and its condition, please provide detailed resale information including:\n`;
    prompt += `1. Current market value estimate\n`;
    prompt += `2. Factors affecting my vehicle's resale value\n`;
    prompt += `3. Recommended improvements to increase resale value\n`;
    prompt += `4. Best time to sell\n`;
    prompt += `5. Trade-in vs. private sale comparison\n\n`;
    prompt += `Please include specific, actionable advice to help me maximize my vehicle's resale value.`;
  }
  else {
    // Default response for any other categories
    prompt += `Based on my responses, please provide detailed insights, recommendations, and next steps. `;
    prompt += `Please be specific and include any relevant details that would be helpful for my situation.`;
  }

  return prompt;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    surveyId?: string;
  };
}) {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  const id = generateUUID();
  let initialMessages: Message[] = [];

  // If a surveyId is present in the URL, fetch the data and create an initial prompt
  if (searchParams?.surveyId) {
    try {
      const surveyDataResult = await db
        .select()
        .from(surveyResponses)
        .where(eq(surveyResponses.id, searchParams.surveyId))
        .limit(1);

      if (surveyDataResult.length > 0) {
        // We cast here because Drizzle returns a generic type
        const surveyData = surveyDataResult[0] as SurveyData;
        const prompt = generatePromptFromSurvey(surveyData);
        
        // Create a new array with the user message
        initialMessages = [
          // Include any existing messages (should be empty in this case)
          ...initialMessages,
          // Add the user message with survey data
          {
            id: generateUUID(),
            role: 'user' as const,
            content: prompt,
            // @ts-ignore - Add a flag to identify this as a survey message
            isSurveyMessage: true
          }
        ];
      } else {
        console.warn(`Survey with ID ${searchParams.surveyId} not found.`);
      }
    } catch (error) {
      console.error('Failed to fetch survey data:', error);
      // Don't block the user, just start a normal chat
    }
  }

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');
  const chatModel = modelIdFromCookie?.value || DEFAULT_CHAT_MODEL;

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={initialMessages}
        initialChatModel={chatModel}
        initialVisibilityType="private"
        isReadonly={false}
        session={session}
        autoResume={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
