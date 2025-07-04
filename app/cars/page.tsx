'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateUUID } from '@/lib/utils';
import { createComparisonChat, pollForComparisonResult, Car as CarType } from '@/lib/car-comparison';
import { Spinner } from '@/components/ui/spinner';
import { CarComparisonParser } from '@/components/car-comparison-parser';

const carData = [
  { 
    id: 1, 
    name: 'Land Cruiser', 
    image: '/images/landcruiser.jpeg',
    engine: '3.3L Twin-Turbo V6 Diesel',
    power: '309 HP',
    torque: '700 Nm',
    transmission: '10-speed Automatic',
    fuelEfficiency: '8.9 km/l',
    seatingCapacity: '7',
    price: '$85,000'
  },
  { 
    id: 2, 
    name: 'Glanza', 
    image: '/images/glanza.jpg',
    engine: '1.2L K-Series Petrol',
    power: '83 HP',
    torque: '113 Nm',
    transmission: '5-speed Manual/CVT',
    fuelEfficiency: '22.3 km/l',
    seatingCapacity: '5',
    price: '$12,500'
  },
  { 
    id: 3, 
    name: 'Rumion', 
    image: '/images/Rumion.jpg',
    engine: '1.5L K-Series Petrol',
    power: '103 HP',
    torque: '138 Nm',
    transmission: '5-speed Manual/4-speed Automatic',
    fuelEfficiency: '20.1 km/l',
    seatingCapacity: '7',
    price: '$16,800'
  },
  { 
    id: 4, 
    name: 'Vellfire', 
    image: '/images/vellfire.jpeg',
    engine: '2.5L Hybrid',
    power: '197 HP',
    torque: '239 Nm',
    transmission: 'E-CVT',
    fuelEfficiency: '19.2 km/l',
    seatingCapacity: '7',
    price: '$75,000'
  },
  { 
    id: 5, 
    name: 'Innova', 
    image: '/images/innova.png',
    engine: '2.0L Petrol/2.4L Diesel',
    power: '174 HP',
    torque: '197 Nm',
    transmission: '6-speed Manual/Automatic',
    fuelEfficiency: '16.5 km/l',
    seatingCapacity: '7/8',
    price: '$32,000'
  },
  { 
    id: 6, 
    name: 'Fortuner', 
    image: '/images/fortuner.jpeg',
    engine: '2.8L Turbo Diesel',
    power: '204 HP',
    torque: '500 Nm',
    transmission: '6-speed Automatic',
    fuelEfficiency: '14.2 km/l',
    seatingCapacity: '7',
    price: '$42,000'
  },
  { 
    id: 7, 
    name: 'Urban Cruiser', 
    image: '/images/urban cruiser.jpg',
    engine: '1.5L K-Series Petrol',
    power: '103 HP',
    torque: '138 Nm',
    transmission: '5-speed Manual/4-speed Automatic',
    fuelEfficiency: '18.8 km/l',
    seatingCapacity: '5',
    price: '$14,500'
  },
  { 
    id: 8, 
    name: 'Camry', 
    image: '/images/camry.jpeg',
    engine: '2.5L Hybrid',
    power: '218 HP',
    torque: '221 Nm',
    transmission: 'E-CVT',
    fuelEfficiency: '23.4 km/l',
    seatingCapacity: '5',
    price: '$39,000'
  },
  { 
    id: 9, 
    name: 'Hyrider', 
    image: '/images/hyrider.jpg',
    engine: '1.5L Strong Hybrid',
    power: '115 HP',
    torque: '141 Nm',
    transmission: 'e-Drive',
    fuelEfficiency: '27.5 km/l',
    seatingCapacity: '5',
    price: '$22,000'
  },
  { 
    id: 10, 
    name: 'Hilux', 
    image: '/images/hilux.jpg',
    engine: '2.8L Turbo Diesel',
    power: '204 HP',
    torque: '500 Nm',
    transmission: '6-speed Automatic',
    fuelEfficiency: '12.8 km/l',
    seatingCapacity: '5',
    price: '$35,000'
  },
];

export default function CarsPage() {
  const router = useRouter();
  const [selectedCars, setSelectedCars] = useState<number[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedCarDetails, setSelectedCarDetails] = useState<any>(null);
  const [aiComparison, setAiComparison] = useState<string>('');
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);
  const [showAiComparison, setShowAiComparison] = useState(false);

  // Function to handle adding a car to compare
  const handleCompare = (carId: number) => {
    if (selectedCars.includes(carId)) {
      // If car is already selected, remove it
      setSelectedCars(selectedCars.filter(id => id !== carId));
      toast.success('Car removed from comparison');
    } else if (selectedCars.length < 2) {
      // If less than 2 cars are selected, add this one
      setSelectedCars([...selectedCars, carId]);
      toast.success('Car added to comparison');
    } else {
      toast.error('You can only compare 2 cars at a time');
    }
  };

  // Function to show car details
  const showDetails = (car: any) => {
    setSelectedCarDetails(car);
    setShowDetailsModal(true);
  };

  // Function to compare cars and show the comparison modal
  const showComparison = () => {
    if (selectedCars.length === 2) {
      // Show the modal
      setShowCompareModal(true);
    } else {
      toast.error('Please select two cars to compare');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Toyota AI Comparison</h1>
      </header>

      <main className="flex-1 relative">
        {/* Comparison button - shows only when cars are selected */}
        {selectedCars.length > 0 && (
          <div className="fixed bottom-4 right-4 z-50">
            <Button 
              onClick={showComparison}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Compare Selected ({selectedCars.length}/2)
            </Button>
          </div>
        )}
        
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Car Lineup</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore our premium selection of high-quality vehicles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {carData.map((car) => (
                <div 
                  key={car.id} 
                  className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-muted"
                >
                  <div className="relative w-full h-52 mb-4 overflow-hidden rounded-md">
                    <Image 
                      src={car.image} 
                      alt={car.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                    {/* Badge to show if car is selected for comparison */}
                    {selectedCars.includes(car.id) && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        Selected for comparison
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold mt-2">{car.name}</h3>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-2 mt-4 w-full">
                    <Button 
                      onClick={() => showDetails(car)}
                      className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      variant="outline"
                    >
                      Details
                    </Button>
                    <Button 
                      onClick={() => handleCompare(car.id)}
                      className={`flex-1 ${
                        selectedCars.includes(car.id) 
                          ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                      variant="default"
                    >
                      {selectedCars.includes(car.id) ? 'Remove' : 'Compare'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex gap-4 justify-center mt-8">
          <Button 
            onClick={() => router.push('/compare')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get Started
          </Button>
          <Link href="/aisurvey">
            <Button variant="outline">AI Survey</Button>
          </Link>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedCarDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{selectedCarDetails.name} Details</h2>
                  <Button 
                    onClick={() => setShowDetailsModal(false)}
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="relative w-full h-64 mb-6 overflow-hidden rounded-md">
                  <Image 
                    src={selectedCarDetails.image} 
                    alt={selectedCarDetails.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Engine:</span>
                      <span>{selectedCarDetails.engine}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Power:</span>
                      <span>{selectedCarDetails.power}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Torque:</span>
                      <span>{selectedCarDetails.torque}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Transmission:</span>
                      <span>{selectedCarDetails.transmission}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Fuel Efficiency:</span>
                      <span>{selectedCarDetails.fuelEfficiency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Seating Capacity:</span>
                      <span>{selectedCarDetails.seatingCapacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Price:</span>
                      <span>{selectedCarDetails.price}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={() => setShowDetailsModal(false)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Compare Modal */}
        {showCompareModal && selectedCars.length === 2 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Car Comparison</h2>
                  <Button 
                    onClick={() => setShowCompareModal(false)}
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="relative flex flex-col">
                  {/* Car Images and Names */}
                  <div className="flex items-start mb-8">
                    {selectedCars.map((carId, index) => {
                      const car = carData.find(c => c.id === carId);
                      return car ? (
                        <div key={car.id} className="flex-1 text-center p-4">
                          <div className="relative w-full h-48 mb-3 overflow-hidden rounded-md">
                            <Image 
                              src={car.image} 
                              alt={car.name}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <h3 className="text-2xl font-semibold">{car.name}</h3>
                        </div>
                      ) : null;
                    })}
                    
                    {/* Vertical Line */}
                    <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-border"></div>
                  </div>
                  
                  {showAiComparison && (
                    <div className="mt-6">
                      {isLoadingComparison ? (
                        <div className="flex flex-col items-center py-8">
                          <Spinner className="h-8 w-8" />
                          <p className="mt-4 text-muted-foreground">Generating AI comparison...</p>
                        </div>
                      ) : aiComparison ? (
                        <CarComparisonParser 
                          aiText={aiComparison} 
                          carNames={selectedCars.map(id => {
                            const car = carData.find(c => c.id === id);
                            return car?.name || '';
                          }).filter(Boolean)} 
                        />
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No comparison generated yet
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-between">
                    <Button 
                      onClick={async () => {
                        console.log('Starting AI comparison generation');
                        // Find the selected cars by their numeric IDs
                        const car1 = carData.find(c => c.id === selectedCars[0]);
                        const car2 = carData.find(c => c.id === selectedCars[1]);
                        
                        console.log('Selected cars:', { car1, car2, selectedCars });
                        
                        if (car1 && car2) {
                          try {
                            console.log('Setting loading state and showing AI comparison section');
                            setIsLoadingComparison(true);
                            setShowAiComparison(true);
                            setAiComparison(''); // Clear any previous comparison
                            
                            // Force a re-render to show the loading state
                            await new Promise(resolve => setTimeout(resolve, 100));
                            
                            console.log('Creating comparison chat...');
                            // Create a new chat with the comparison query
                            const { chatId, query } = await createComparisonChat(car1 as CarType, car2 as CarType);
                            console.log('Chat created with ID:', chatId);
                            
                            // Show the query that was sent while waiting for the response
                            setAiComparison(`Generating comparison between ${car1.name} and ${car2.name}...

Query sent to AI:
${query.substring(0, 150)}...`);
                            
                            // Poll for the AI response
                            console.log('Polling for AI response...');
                            // Pass the car objects to the polling function for fallback mechanism
                            const comparisonResult = await pollForComparisonResult(chatId, 20, car1, car2);
                            console.log('Received comparison result:', comparisonResult?.substring(0, 100) + '...');
                            
                            if (comparisonResult && comparisonResult.length > 0) {
                              // Update the state with the AI response
                              console.log('Updating state with AI response');
                              setAiComparison(comparisonResult);
                              setIsLoadingComparison(false);
                              toast.success('AI comparison generated!');
                            } else {
                              throw new Error('Empty response received from AI');
                            }
                          } catch (error) {
                            console.error('Error generating comparison:', error);
                            setIsLoadingComparison(false);
                            setAiComparison(`Sorry, there was an error generating the comparison. Please try again.

Error details: ${error instanceof Error ? error.message : String(error)}`);
                            toast.error('Failed to generate comparison');
                          }
                        }
                      }}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      disabled={isLoadingComparison}
                    >
                      {isLoadingComparison ? 'Generating...' : 'Get AI Comparison'}
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowCompareModal(false);
                        // Reset AI comparison state when closing the modal
                        setShowAiComparison(false);
                        setAiComparison('');
                        setIsLoadingComparison(false);
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full py-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Chatbot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
