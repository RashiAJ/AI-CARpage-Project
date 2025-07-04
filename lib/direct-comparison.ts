import { Car } from './car-comparison';

// Function to generate a detailed comparison between two cars
export async function generateDirectComparison(car1: Car, car2: Car): Promise<string> {
  // This is a simplified version that generates a comparison directly without using the chat API
  // In a real implementation, you would call your AI API directly here
  
  // For now, we'll create a static comparison to demonstrate the UI functionality
  return `# Comparison: ${car1.name} vs ${car2.name}

## Performance
The ${car1.name} features a ${car1.engine} engine producing ${car1.power}, while the ${car2.name} comes with a ${car2.engine} engine delivering ${car2.power}. ${car1.power > car2.power ? `The ${car1.name} offers more power, making it better for performance-oriented drivers.` : `The ${car2.name} offers more power, making it better for performance-oriented drivers.`}

## Efficiency
In terms of fuel efficiency, the ${car1.name} achieves ${car1.fuelEfficiency} while the ${car2.name} delivers ${car2.fuelEfficiency}. ${car1.fuelEfficiency > car2.fuelEfficiency ? `The ${car1.name} is more fuel-efficient, making it better for daily commuting and long trips.` : `The ${car2.name} is more fuel-efficient, making it better for daily commuting and long trips.`}

## Practicality
The ${car1.name} offers seating for ${car1.seatingCapacity}, while the ${car2.name} can accommodate ${car2.seatingCapacity} passengers. ${car1.seatingCapacity > car2.seatingCapacity ? `The ${car1.name} is more suitable for larger families or groups.` : car1.seatingCapacity < car2.seatingCapacity ? `The ${car2.name} is more suitable for larger families or groups.` : `Both vehicles offer the same passenger capacity.`}

## Value
Priced at ${car1.price}, the ${car1.name} ${car1.price < car2.price ? 'represents better value compared to' : 'is more expensive than'} the ${car2.name} at ${car2.price}.

## Recommendation
If performance is your priority, the ${car1.power > car2.power ? car1.name : car2.name} is the better choice.
If fuel efficiency matters most, consider the ${car1.fuelEfficiency > car2.fuelEfficiency ? car1.name : car2.name}.
For families, the ${car1.seatingCapacity >= car2.seatingCapacity ? car1.name : car2.name} offers ${car1.seatingCapacity >= car2.seatingCapacity ? 'equal or better' : 'better'} seating capacity.
If budget is a concern, the ${car1.price < car2.price ? car1.name : car2.name} is more affordable.`;
}
