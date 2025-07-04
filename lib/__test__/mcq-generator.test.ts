import { generateMCQs } from '@/lib/mcq-generator';

describe('MCQ Generator', () => {
  it('should be properly imported', () => {
    expect(generateMCQs).toBeDefined();
  });
});
