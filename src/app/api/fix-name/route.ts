import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const VOTES_KEY = 'peter-pan-votes';
const POLLS_KEY = 'peter-pan-polls';

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

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  eventDate?: string | null;
  deadline?: string | null;
  allowMultipleAnswers?: boolean;
  options: PollOption[];
  createdAt: string;
  isActive: boolean;
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
        deletedCount: 0
      });
    }

    console.log(`Found ${votes.length} votes`);

    // Find and remove votes with old name
    let deletedCount = 0;
    const votesToDelete: Vote[] = [];
    const updatedVotes = votes.filter(vote => {
      if (vote.voterName === 'ליאור תמיר') {
        deletedCount++;
        votesToDelete.push(vote);
        return false; // Remove this vote
      }
      return true; // Keep this vote
    });

    if (deletedCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'No votes found with the name "ליאור תמיר"',
        deletedCount: 0
      });
    }

    // Update vote counts in polls
    const polls = await redis.get<Poll[]>(POLLS_KEY);
    if (polls) {
      votesToDelete.forEach(vote => {
        const pollIndex = polls.findIndex(p => p.id === vote.pollId);
        if (pollIndex !== -1) {
          const optionIds = vote.optionIds || [vote.optionId];
          optionIds.forEach(optionId => {
            const optionIndex = polls[pollIndex].options.findIndex(o => o.id === optionId);
            if (optionIndex !== -1 && polls[pollIndex].options[optionIndex].votes > 0) {
              polls[pollIndex].options[optionIndex].votes -= 1;
            }
          });
        }
      });
      await redis.set(POLLS_KEY, polls);
    }

    // Save updated votes back to database
    await redis.set(VOTES_KEY, updatedVotes);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} vote(s) for "ליאור תמיר"`,
      deletedCount
    });
  } catch (error) {
    console.error('Error deleting votes:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete votes',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
