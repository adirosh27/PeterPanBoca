import { NextResponse } from 'next/server';
import { getWorldCupVotes, getWorldCupTally } from '@/lib/worldcup-db';

export async function GET() {
  try {
    const [votes, tally] = await Promise.all([getWorldCupVotes(), getWorldCupTally()]);

    return NextResponse.json({ success: true, votes, tally });
  } catch (error) {
    console.error('Error in GET /api/worldcup/results:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get results',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
