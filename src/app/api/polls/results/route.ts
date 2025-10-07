import { NextRequest, NextResponse } from 'next/server';
import { getPollResults } from '@/lib/poll-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get('pollId');

    if (!pollId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Poll ID is required'
        },
        { status: 400 }
      );
    }

    const results = await getPollResults(pollId);

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error) {
    console.error('Error in GET /api/polls/results:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get poll results',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
