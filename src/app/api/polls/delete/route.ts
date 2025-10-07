import { NextRequest, NextResponse } from 'next/server';
import { deletePoll } from '@/lib/poll-db';

export async function DELETE(request: NextRequest) {
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

    const success = await deletePoll(pollId);

    if (!success) {
      throw new Error('Failed to delete poll');
    }

    return NextResponse.json({
      success: true,
      message: 'Poll deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/polls/delete:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete poll',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
