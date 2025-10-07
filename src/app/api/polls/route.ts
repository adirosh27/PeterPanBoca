import { NextRequest, NextResponse } from 'next/server';
import { getAllPolls, getActivePoll, createPoll } from '@/lib/poll-db';

// GET - Get all polls or active poll
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    if (activeOnly) {
      const poll = await getActivePoll();
      return NextResponse.json({
        success: true,
        poll
      });
    }

    const polls = await getAllPolls();
    return NextResponse.json({
      success: true,
      polls
    });
  } catch (error) {
    console.error('Error in GET /api/polls:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get polls',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create a new poll
export async function POST(request: NextRequest) {
  try {
    const { question, options, eventDate } = await request.json();

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid poll data. Question and at least 2 options are required.'
        },
        { status: 400 }
      );
    }

    const poll = await createPoll(question, options, eventDate);

    if (!poll) {
      throw new Error('Failed to create poll');
    }

    return NextResponse.json({
      success: true,
      poll
    });
  } catch (error) {
    console.error('Error in POST /api/polls:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create poll',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
