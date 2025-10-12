import { NextRequest, NextResponse } from 'next/server';
import { deleteVote } from '@/lib/poll-db';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get('pollId');
    const voterEmail = searchParams.get('voterEmail');

    if (!pollId || !voterEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required parameters'
        },
        { status: 400 }
      );
    }

    const success = await deleteVote(pollId, voterEmail);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vote not found or could not be deleted'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vote deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/polls/delete-vote:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete vote',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
