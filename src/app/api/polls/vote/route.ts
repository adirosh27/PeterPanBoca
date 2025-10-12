import { NextRequest, NextResponse } from 'next/server';
import { submitVote } from '@/lib/poll-db';

export async function POST(request: NextRequest) {
  try {
    const { pollId, voterName, voterEmail, optionId, comment } = await request.json();

    if (!pollId || !voterName || !voterEmail || !optionId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    // Capture IP address from request headers
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    const success = await submitVote(pollId, voterName, voterEmail, optionId, comment, ipAddress);

    if (!success) {
      throw new Error('Failed to submit vote');
    }

    return NextResponse.json({
      success: true,
      message: 'Vote submitted successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/polls/vote:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit vote',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
