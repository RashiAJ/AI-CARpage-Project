// lib/dify-client.ts

// This type should be in sync with the one in app/aisurvey/page.tsx
export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

/**
 * Fetches dynamically generated MCQs by calling our own backend API route.
 * This provides a layer of security by not exposing the Dify API key to the client.
 * @param category The category for which to generate questions.
 * @returns A promise that resolves to an array of MCQ objects.
 */
export async function fetchDifyQuestions(category: string): Promise<MCQ[]> {
  try {
    const response = await fetch('/api/dify-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    });

    if (!response.ok) {
      let errorMessage = `Request failed with status: ${response.status}`;
      try {
        // Try to parse a specific error message from the backend's JSON response
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If the backend returns a non-JSON error (e.g., a server crash page),
        // we fall back to the raw text response.
        const textError = await response.text();
        errorMessage = textError || errorMessage;
        console.error("Backend did not return JSON. Raw response:", errorMessage);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const generatedQuestions = data.questions || [];

    // Map the response to the MCQ type used by the frontend
    const mcqs: MCQ[] = generatedQuestions.map((q: any) => ({
      question: q.text,
      options: q.options,
      correctAnswer: '', // Dify doesn't provide a correct answer in this setup
    }));

    return mcqs;

  } catch (error) {
    console.error('Error in fetchDifyQuestions (client-side):', error);
    // Re-throw the error so the component can catch it and show a toast message
    throw error;
  }
}
