import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // For now, we'll use a mock API response since the backend Lambda isn't deployed yet
    // Replace this URL with your actual API Gateway URL after deploying the backend
    const API_URL = process.env.ANALYZE_API_URL || 'http://localhost:3000/api/analyze';
    
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
  } catch (error) {
    console.error('Error analyzing document:', error);
    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
