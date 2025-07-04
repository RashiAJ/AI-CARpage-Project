import { generateUUID } from './utils';
import { DEFAULT_CHAT_MODEL } from './ai/models';

// Type definitions for car data
export interface Car {
  id: number | string;
  name: string;
  image: string;
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  fuelEfficiency: string;
  seatingCapacity: string;
  price: string;
  [key: string]: string | number; // Allow any string property
}

// Function to create a comparison query between two cars
export function generateComparisonQuery(car1: Car, car2: Car): string {
  return `Please provide a detailed comparison between ${car1.name} and ${car2.name} with the following specifications:\n\n${car1.name}:\n- Engine: ${car1.engine}\n- Power: ${car1.power}\n- Torque: ${car1.torque}\n- Transmission: ${car1.transmission}\n- Fuel Efficiency: ${car1.fuelEfficiency}\n- Seating Capacity: ${car1.seatingCapacity}\n- Price: ${car1.price}\n\n${car2.name}:\n- Engine: ${car2.engine}\n- Power: ${car2.power}\n- Torque: ${car2.torque}\n- Transmission: ${car2.transmission}\n- Fuel Efficiency: ${car2.fuelEfficiency}\n- Seating Capacity: ${car2.seatingCapacity}\n- Price: ${car2.price}\n\nPlease highlight the key differences between these cars and provide recommendations based on different use cases and priorities (e.g., performance, fuel efficiency, family use, value for money , without creating a document).`;
}

// Function to create a new chat and send a comparison message
export async function createComparisonChat(car1: Car, car2: Car) {
  const chatId = generateUUID();
  const messageId = generateUUID();
  const query = generateComparisonQuery(car1, car2);
  
  console.log('Creating chat with ID:', chatId);
  console.log('Message ID:', messageId);
  console.log('Query preview:', query.substring(0, 100) + '...');
  
  try {
    // Create the chat with the comparison query
    console.log('Sending POST request to /api/chat');
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: chatId,
        message: {
          id: messageId,
          createdAt: new Date(),
          role: 'user',
          content: query,
          parts: [{ type: 'text', text: query }],
        },
        selectedChatModel: DEFAULT_CHAT_MODEL,
        selectedVisibilityType: 'private',
      }),
    });

    console.log('POST response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error response:', errorData);
      throw new Error(`Failed to create chat: ${response.status} ${errorData}`);
    }

    console.log('Chat created successfully');
    return { chatId, messageId, query };
  } catch (error) {
    console.error('Error creating comparison chat:', error);
    throw error;
  }
}

// Function to fetch messages for a specific chat
export async function getChatMessages(chatId: string) {
  try {
    console.log(`Fetching messages for chat ID: ${chatId}`);
    // Based on the API implementation, we need to use the correct endpoint
    // The GET handler in chat/route.ts expects a chatId parameter
    const response = await fetch(`/api/chat?chatId=${chatId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`Failed to fetch chat messages: ${response.status} ${errorText}`);
    }
    
    // Check if the response has content before parsing
    const text = await response.text();
    console.log('Response text length:', text.length);
    
    if (!text || text.trim() === '') {
      console.log('Empty response received');
      return [];
    }
    
    // Check if the response is in streaming format (contains lines with prefixes like f:, 0:, e:, d:)
    if (text.includes('0:"') || text.includes('f:{')) {
      console.log('Detected streaming format response');
      
      // Extract the content from the streaming format
      let content = '';
      const lines = text.split('\n');
      
      for (const line of lines) {
        // Extract text content from lines that start with 0:"
        if (line.startsWith('0:"')) {
          content += line.substring(3, line.length - 1);
        }
      }
      
      console.log('Extracted content from streaming format:', content.substring(0, 100) + '...');
      
      // Create a synthetic message object with the extracted content
      return [{
        role: 'assistant',
        id: 'extracted-content',
        content: content
      }];
    }
    
    // If not in streaming format, try to parse as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError: any) {
      console.error('Error parsing JSON response:', parseError);
      
      // If we can't parse as JSON but have text, return it as a message
      if (text.length > 0) {
        console.log('Returning raw text as message content');
        return [{
          role: 'assistant',
          id: 'raw-content',
          content: text
        }];
      }
      
      throw new Error(`Failed to parse chat messages: ${parseError.message || 'Unknown parsing error'}`);
    }
    
    // The API might return messages in different formats depending on the endpoint
    // Handle both array format and object with messages property
    const messages = Array.isArray(data) ? data : data.messages || [];
    
    console.log(`Successfully fetched ${messages.length} messages`);
    if (messages.length > 0) {
      console.log('Message roles:', messages.map((m: any) => m.role).join(', '));
      messages.forEach((msg: any, index: number) => {
        console.log(`Message ${index + 1} - Role: ${msg.role}, ID: ${msg.id}`);
        if (msg.parts && msg.parts.length > 0) {
          console.log(`  Parts: ${msg.parts.length}, First part type: ${msg.parts[0].type}`);
        }
        if (msg.content) {
          console.log(`  Content: ${msg.content.substring(0, 50)}...`);
        }
      });
    }
    
    return messages;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
}

// Function to poll for chat messages until an assistant response is received
export async function pollForComparisonResult(chatId: string, maxAttempts = 20, car1?: Car, car2?: Car): Promise<string> {
  let attempts = 0;
  
  console.log(`Starting to poll for comparison result. Chat ID: ${chatId}, Max attempts: ${maxAttempts}`);
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`Polling attempt ${attempts}/${maxAttempts}`);
    
    try {
      // Wait between polling attempts
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`Fetching messages for chat ${chatId}`);
      let messages;
      try {
        messages = await getChatMessages(chatId);
      } catch (error) {
        console.error(`Error in polling attempt ${attempts}:`, error);
        // If we're on the last few attempts, wait longer between retries
        const waitTime = attempts > maxAttempts - 3 ? 5000 : 2000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      if (!messages || messages.length === 0) {
        console.log('No messages received, waiting before trying again');
        continue;
      }
      
      // Find the assistant message (the AI's response)
      const assistantMessage = messages.find((m: any) => m.role === 'assistant');
      
      if (assistantMessage) {
        console.log('Found assistant message');
        
        // Extract the content from the message
        // Different message formats might store content differently
        let content = '';
        
        if (assistantMessage.content) {
          content = assistantMessage.content;
          console.log('Found content directly in message.content');
        } else if (assistantMessage.parts && assistantMessage.parts.length > 0) {
          // Some APIs return content in parts array
          content = assistantMessage.parts
            .filter((part: any) => part.type === 'text')
            .map((part: any) => part.text)
            .join('\n');
          console.log('Found content in message.parts');
        }
        
        // If still no content, check if the message itself is a string
        if (!content && typeof assistantMessage === 'string') {
          console.log('Message is a string, using directly');
          content = assistantMessage;
        }
        
        if (content && content.trim() !== '') {
          console.log(`Found content: ${content.substring(0, 50)}...`);
          
          // If the content looks like it contains streaming format markers, clean it up
          if (content.includes('0:"') || content.includes('f:{') || content.includes('\n0:')) {
            console.log('Cleaning up streaming format markers in content');
            let cleanedContent = '';
            
            const lines = content.split('\n');
            for (const line of lines) {
              // Skip metadata lines
              if (line.startsWith('f:') || line.startsWith('e:') || line.startsWith('d:')) {
                continue;
              }
              
              // Extract content from streaming format
              if (line.startsWith('0:"')) {
                cleanedContent += line.substring(3, line.length - 1);
              } else {
                cleanedContent += line;
              }
            }
            
            console.log('Cleaned content:', cleanedContent.substring(0, 100) + '...');
            return cleanedContent;
          }
          
          return content;
        } else {
          console.log('No content found in assistant message');
        }
      }
      
      console.log('No valid assistant message found, waiting before trying again');
    } catch (error) {
      console.error('Error polling for comparison result:', error);
    }
  }
  
  console.log(`Max attempts (${maxAttempts}) reached without getting a response`);
  
  // Fallback to a direct comparison if the API fails repeatedly
  console.log('Using fallback direct comparison mechanism');
  
  // If car details are not provided, return a simple error message
  if (!car1 || !car2) {
    return 'The comparison is taking longer than expected. Please try again later.';
  }
  
  // This is a simple fallback that generates a basic comparison
  // It's not as sophisticated as the AI response but provides something useful
  return `# Comparison between ${car1.name} and ${car2.name}

## Specifications

### ${car1.name}
- Engine: ${car1.engine}
- Power: ${car1.power}
- Torque: ${car1.torque}
- Transmission: ${car1.transmission}
- Fuel Efficiency: ${car1.fuelEfficiency}
- Seating Capacity: ${car1.seatingCapacity}
- Price: ${car1.price}

### ${car2.name}
- Engine: ${car2.engine}
- Power: ${car2.power}
- Torque: ${car2.torque}
- Transmission: ${car2.transmission}
- Fuel Efficiency: ${car2.fuelEfficiency}
- Seating Capacity: ${car2.seatingCapacity}
- Price: ${car2.price}

## Key Differences
- Engine: ${car1.engine} vs ${car2.engine}
- Power: ${car1.power} vs ${car2.power}
- Price: ${car1.price} vs ${car2.price}

This is a fallback comparison generated because the AI comparison service is currently unavailable. Please try again later for a more detailed AI-powered comparison.`;
}
