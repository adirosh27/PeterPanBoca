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
        removedCount: 0
      });
    }

    console.log(`Found ${votes.length} votes`);

    // Find votes for "ליאור טמיר" in poll 1760213716299
    const targetPollId = '1760213716299';
    const targetName = 'ליאור טמיר';

    const matchingVotes = votes.filter(vote =>
      vote.pollId === targetPollId && vote.voterName === targetName
    );

    if (matchingVotes.length === 0) {
      return NextResponse.json({
        success: true,
        message: `No votes found for "${targetName}" in poll ${targetPollId}`,
        removedCount: 0
      });
    }

    if (matchingVotes.length === 1) {
      return NextResponse.json({
        success: true,
        message: `Only one vote found for "${targetName}" in poll ${targetPollId}, not removing`,
        removedCount: 0
      });
    }

    // Sort by votedAt ascending (oldest first) and remove the oldest one
    matchingVotes.sort((a, b) => new Date(a.votedAt).getTime() - new Date(b.votedAt).getTime());
    const voteToRemove = matchingVotes[0]; // Remove the oldest vote

    // Filter out the vote to remove
    const updatedVotes = votes.filter(vote => vote.voterId !== voteToRemove.voterId);

    // Update vote counts in polls
    const polls = await redis.get<Poll[]>(POLLS_KEY);
    if (polls) {
      const pollIndex = polls.findIndex(p => p.id === targetPollId);
      if (pollIndex !== -1) {
        const optionIds = voteToRemove.optionIds || [voteToRemove.optionId];
        optionIds.forEach(optionId => {
          const optionIndex = polls[pollIndex].options.findIndex(o => o.id === optionId);
          if (optionIndex !== -1 && polls[pollIndex].options[optionIndex].votes > 0) {
            polls[pollIndex].options[optionIndex].votes -= 1;
          }
        });
      }
      await redis.set(POLLS_KEY, polls);
    }

    // Save updated votes back to database
    await redis.set(VOTES_KEY, updatedVotes);

    return NextResponse.json({
      success: true,
      message: `Successfully removed one duplicate vote for "${targetName}"`,
      removedCount: 1,
      details: {
        voterName: voteToRemove.voterName,
        pollId: voteToRemove.pollId,
        votedAt: voteToRemove.votedAt,
        wasOldest: true
      }
    });
  } catch (error) {
    console.error('Error removing duplicate:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to remove duplicate',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
