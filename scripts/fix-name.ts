// Script to update voter name in database from "ליאור תמיר" to "ליאור טמיר"
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

async function fixVoterName() {
  // Initialize Redis client
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.error('Redis credentials not found in environment variables');
    process.exit(1);
  }

  const redis = new Redis({ url, token });

  try {
    // Get all votes
    const votes = await redis.get<Vote[]>(VOTES_KEY);

    if (!votes || votes.length === 0) {
      console.log('No votes found in database');
      return;
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
      console.log('No votes found with the name "ליאור תמיר"');
      return;
    }

    // Save updated votes back to database
    await redis.set(VOTES_KEY, updatedVotes);

    console.log(`✅ Successfully updated ${updatedCount} vote(s) from "ליאור תמיר" to "ליאור טמיר"`);
  } catch (error) {
    console.error('Error updating votes:', error);
    process.exit(1);
  }
}

fixVoterName();
