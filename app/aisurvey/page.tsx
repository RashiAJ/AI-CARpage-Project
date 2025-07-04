'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { fetchDifyQuestions } from '@/lib/dify-client'; // Updated import
import { toast } from 'sonner';

// Exporting types so they can be used by other modules if needed
export type MCQ = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type SurveyOption = {
  id: string;
  title: string;
  chatPrompt: string;
};

export default function AISurveyPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<SurveyOption | null>(null);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [isLoading, setIsLoading] = useState(false); // For fetching questions
  const [isSubmitting, setIsSubmitting] = useState(false); // For submitting answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  
  const surveyOptions: SurveyOption[] = [
    { 
      id: 'recommendations', 
      title: 'Car Recommendations',
      chatPrompt: 'I need help choosing a Toyota model based on my budget and needs.'
    },
    { 
      id: 'parts', 
      title: 'Parts & Accessories',
      chatPrompt: 'I need information about Toyota parts and accessories.'
    },
    { 
      id: 'maintenance', 
      title: 'Maintenance',
      chatPrompt: 'I have questions about Toyota maintenance schedules.'
    },
    { 
      id: 'resale', 
      title: 'Resale Value',
      chatPrompt: 'I want to understand Toyota resale values better.'
    },
  ];

  const handleOptionClick = async (option: SurveyOption) => {
    setIsLoading(true);
    setSelectedAnswers({});
    try {
      // Fetch questions from Dify using the option's title as the category
      const questions = await fetchDifyQuestions(option.title);
      setMcqs(questions);
      setSelectedOption(option);
      
      if (questions.length > 0) {
        toast.success('Questions generated successfully!');
      } else {
        toast.error('No questions were returned from the survey service.');
      }
    } catch (error) {
      console.error('Error fetching questions from Dify:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(`Failed to generate questions: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleSubmit = async () => {
    if (!selectedOption || Object.keys(selectedAnswers).length === 0) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Saving your responses...');

    try {
      const response = await fetch('/api/save-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedOption.title,
          questions: mcqs, // Send the full MCQ structure
          answers: selectedAnswers, // Send the user's answers
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save survey responses.');
      }

      const { chatId, surveyId } = await response.json();

      if (!chatId || !surveyId) {
        throw new Error('Did not receive required IDs from the server.');
      }

      toast.success('Responses saved! Redirecting to your new chat...', { id: toastId });

      // Redirect to the chat page with surveyId as a query parameter
      // This will trigger the auto-response in the chat page
      router.push(`/chat?surveyId=${surveyId}`);

    } catch (error) {
      console.error('Error submitting survey:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(`Submission failed: ${errorMessage}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center">How can we help you today?</h1>
      
      {!selectedOption ? (
        <div className="grid gap-4 w-full max-w-md">
          {surveyOptions.map((option) => (
            <Button
              key={option.id}
              className="w-full py-6 text-lg hover:scale-[1.02] transition-transform"
              variant="outline"
              onClick={() => handleOptionClick(option)}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : option.title}
            </Button>
          ))}
          <Button 
            variant="ghost" 
            className="text-blue-600 hover:text-blue-800 mt-8"
            onClick={() => router.push('/')}
          >
            ← Back to Main Page
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-3xl">
          <div className="mb-6 flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={() => {
                setSelectedOption(null);
                setMcqs([]); // Clear questions on going back
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Options
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={isSubmitting || Object.keys(selectedAnswers).length === 0}
            >
              Submit and Chat with AI
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center flex-col py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-lg">Generating questions with AI...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {mcqs.map((mcq, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold mb-4">{index + 1}. {mcq.question}</h3>
                  <div className="grid gap-3">
                    {mcq.options.map((option, i) => (
                      <Button
                        key={i}
                        variant={selectedAnswers[index] === option ? 'default' : 'outline'}
                        className="justify-start text-left py-3 px-4 transition-colors h-auto whitespace-normal"
                        onClick={() => handleAnswerSelect(index, option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
