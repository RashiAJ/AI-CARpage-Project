'use client';

interface CarSpecs {
  engine?: string;
  power?: string;
  torque?: string;
  transmission?: string;
  fuelEfficiency?: string;
  seatingCapacity?: string;
  price?: string;
}

interface CarComparisonParserProps {
  aiText: string;
  carNames: string[];
  carSpecs: Record<string, CarSpecs>;
}

export function CarComparisonParser({ 
  aiText, 
  carNames = [], 
  carSpecs = {} 
}: CarComparisonParserProps) {
  if (!carNames || carNames.length === 0) {
    return (
      <div className="max-w-none bg-white p-4 rounded-lg border">
        <p>No cars selected for comparison</p>
      </div>
    );
  }

  // Safely process AI text
  const processedText = (aiText || '')
    .replace(/\\n/g, '\n')
    .replace(/\n/g, '<br />')
    .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-blue-600">$1</span>');

  return (
    <div className="max-w-none bg-white p-4 rounded-lg border space-y-4">
      <h3 className="text-lg font-semibold mb-2">
        Comparison: {carNames.join(' vs ')}
      </h3>
      
      {/* AI Comparison */}
      {aiText && (
        <div className="pt-4">
          <div 
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: processedText }}
          />
        </div>
      )}
    </div>
  );
}
