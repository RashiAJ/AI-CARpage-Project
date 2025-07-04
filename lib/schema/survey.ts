// lib/schema/survey.ts
import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

/**
 * Defines the schema for storing survey responses.
 * Each record represents a single completed survey.
 */
export const surveyResponses = pgTable('survey_responses', {
  // A unique identifier for each survey submission, generated automatically.
  id: uuid('id').defaultRandom().primaryKey(),
  
  // The category of the survey, e.g., "Car Recommendations".
  category: text('category').notNull(),
  
  // A JSONB field to store the full list of questions and their potential options.
  // Storing the full MCQ structure allows for historical analysis.
  questions: jsonb('questions').notNull(),
  
  // A JSONB field to store the user's selected answers, mapped by question index or ID.
  answers: jsonb('answers').notNull(),
  
  // The timestamp when the survey response was created.
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
