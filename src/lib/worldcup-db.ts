// World Cup 2026 prediction poll storage (Upstash Redis)
// Kept separate from the generic poll system so it never interferes
// with the single "active poll" used for event attendance.
import { Redis } from '@upstash/redis';
import { worldCupTeamsByCode } from './worldcup';

export interface WorldCupVote {
  voterName: string;
  voterEmail: string;
  teamCode: string;
  votedAt: string;
  wasChanged?: boolean;
  ipAddress?: string;
  previousIpAddress?: string;
}

const VOTES_KEY = 'peter-pan-worldcup-votes';

// Initialize Redis client (same resolution order as poll-db)
const redis = (() => {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (url && token) {
    return new Redis({ url, token });
  }

  try {
    return Redis.fromEnv();
  } catch {
    return null;
  }
})();

// Get all World Cup votes
export async function getWorldCupVotes(): Promise<WorldCupVote[]> {
  try {
    if (!redis) {
      console.log('Redis not available, returning empty array');
      return [];
    }

    const votes = await redis.get<WorldCupVote[]>(VOTES_KEY);
    return votes || [];
  } catch (error) {
    console.error('Error getting World Cup votes from Redis:', error);
    return [];
  }
}

// Tally of votes per team code
export async function getWorldCupTally(): Promise<Record<string, number>> {
  const votes = await getWorldCupVotes();
  const tally: Record<string, number> = {};
  votes.forEach((vote) => {
    tally[vote.teamCode] = (tally[vote.teamCode] || 0) + 1;
  });
  return tally;
}

// Submit (or change) a member's prediction. Each member may vote once.
// Throws Error('IP_ALREADY_VOTED:<name>') if this IP already voted as someone else.
export async function submitWorldCupVote(
  voterName: string,
  voterEmail: string,
  teamCode: string,
  ipAddress?: string
): Promise<boolean> {
  try {
    if (!redis) {
      console.log('Redis not available, cannot submit vote');
      return false;
    }

    // Reject unknown teams
    if (!worldCupTeamsByCode[teamCode]) {
      console.log('Unknown team code:', teamCode);
      return false;
    }

    const allVotes = await getWorldCupVotes();

    // Block a single IP from voting on behalf of more than one member
    if (ipAddress) {
      const ipAlreadyVoted = allVotes.find(
        (v) => v.ipAddress === ipAddress && v.voterEmail !== voterEmail
      );

      if (ipAlreadyVoted) {
        console.log(
          `IP ${ipAddress} already voted for ${ipAlreadyVoted.voterName}, cannot vote for ${voterName}`
        );
        throw new Error(`IP_ALREADY_VOTED:${ipAlreadyVoted.voterName}`);
      }
    }

    const existingVoteIndex = allVotes.findIndex((v) => v.voterEmail === voterEmail);

    if (existingVoteIndex !== -1) {
      // Member is changing their prediction
      const existingVote = allVotes[existingVoteIndex];
      const ipChanged = !!(ipAddress && existingVote.ipAddress && ipAddress !== existingVote.ipAddress);

      allVotes[existingVoteIndex] = {
        ...existingVote,
        teamCode,
        votedAt: new Date().toISOString(),
        wasChanged: true,
        ipAddress: ipAddress || existingVote.ipAddress,
        previousIpAddress: ipChanged ? existingVote.ipAddress : existingVote.previousIpAddress,
      };
    } else {
      // New prediction
      allVotes.push({
        voterName,
        voterEmail,
        teamCode,
        votedAt: new Date().toISOString(),
        ipAddress: ipAddress || undefined,
      });
    }

    await redis.set(VOTES_KEY, allVotes);
    return true;
  } catch (error) {
    // Re-throw the IP guard so the API can surface a friendly message
    if (error instanceof Error && error.message.startsWith('IP_ALREADY_VOTED:')) {
      throw error;
    }
    console.error('Error submitting World Cup vote:', error);
    return false;
  }
}

// Delete a member's prediction
export async function deleteWorldCupVote(voterEmail: string): Promise<boolean> {
  try {
    if (!redis) {
      console.log('Redis not available, cannot delete vote');
      return false;
    }

    const allVotes = await getWorldCupVotes();
    const voteIndex = allVotes.findIndex((v) => v.voterEmail === voterEmail);

    if (voteIndex === -1) {
      return false;
    }

    allVotes.splice(voteIndex, 1);
    await redis.set(VOTES_KEY, allVotes);
    return true;
  } catch (error) {
    console.error('Error deleting World Cup vote:', error);
    return false;
  }
}
