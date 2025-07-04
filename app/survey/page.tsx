"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type SurveyOption = {
  id: string;
  title: string;
  description: string;
};  

const SurveyPage = () => {
  const router = useRouter();
  
  const options: SurveyOption[] = [
    { id: 'car-recommendations', title: 'Car Recommendations', description: 'Get personalized Toyota recommendations' },
    { id: 'parts-accessories', title: 'Parts & Accessories', description: 'Find compatible parts for your Toyota' },
    { id: 'maintenance', title: 'Maintenance', description: 'Schedule and track vehicle maintenance' },
    { id: 'resale', title: 'Resale', description: 'Get valuation and selling options' }
  ];

  const handleOptionClick = (optionId: string) => {
    const query = `Create a detailed analysis document about ${optionId.replace('-', ' ')}`;
    router.push(`/chat?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">Toyota AI Assistant</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            className="p-6 border rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h2 className="text-xl font-semibold mb-2">{option.title}</h2>
            <p className="text-gray-600">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SurveyPage;
