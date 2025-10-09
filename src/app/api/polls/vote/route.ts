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

    const success = await submitVote(pollId, voterName, voterEmail, optionId, comment);

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
