import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Get the API URL from environment variable
    const API_URL = process.env.ANALYZE_API_URL;
    
    // If we have a real API endpoint, use it
    if (API_URL) {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }

      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // Return mock data for testing when no API URL is provided
      console.log('Using mock response - ANALYZE_API_URL not configured');
      
      // Create mock data based on the requirements provided
      const mockData = {
        matches: body.requirements.map(req => ({
          requirement_id: req.id,
          requirement_text: req.text,
          matches: [
            {
              segment_text: "This is a sample matching text from the document that would typically be extracted by the AI.",
              confidence_score: 0.87,
              gpt4_explanation: "This is a mock response. In a real environment, GPT-4 would analyze if this segment truly satisfies the requirement and provide an explanation."
            }
          ]
        }))
      };
      
      return NextResponse.json(mockData);
    }
  } catch (error) {
    console.error('Error analyzing document:', error);
    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
