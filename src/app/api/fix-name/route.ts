import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const VOTES_KEY = 'peter-pan-votes';

interface Vote {
  pollId: string;
  voterId: string;
  voterName: string;
  voterEmail: string;
  optionId: string;
  optionIds?: string[];
  votedAt: string;
  wasChanged?: boolean;
  comment?: string;
}

export async function POST() {
  try {
    // Initialize Redis client
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      return NextResponse.json(
        { success: false, message: 'Redis credentials not configured' },
        { status: 500 }
      );
    }

    const redis = new Redis({ url, token });

    // Get all votes
    const votes = await redis.get<Vote[]>(VOTES_KEY);

    if (!votes || votes.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No votes found in database',
        updatedCount: 0
      });
    }

    console.log(`Found ${votes.length} votes`);

    // Update votes with old name
    let updatedCount = 0;
    const updatedVotes = votes.map(vote => {
      if (vote.voterName === 'ליאור תמיר') {
        updatedCount++;
        return {
          ...vote,
          voterName: 'ליאור טמיר',
          voterEmail: vote.voterEmail.replace('ליאור תמיר', 'ליאור טמיר')
        };
      }
      return vote;
    });

    if (updatedCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'No votes found with the name "ליאור תמיר"',
        updatedCount: 0
      });
    }

    // Save updated votes back to database
    await redis.set(VOTES_KEY, updatedVotes);

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedCount} vote(s) from "ליאור תמיר" to "ליאור טמיר"`,
      updatedCount
    });
  } catch (error) {
    console.error('Error updating votes:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update votes',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
