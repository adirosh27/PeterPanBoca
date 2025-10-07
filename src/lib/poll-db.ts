// Poll database utility using Upstash Redis
import { Redis } from '@upstash/redis';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: string;
  isActive: boolean;
}

export interface Vote {
  pollId: string;
  voterId: string;
  voterName: string;
  voterEmail: string;
  optionId: string;
  votedAt: string;
}

const POLLS_KEY = 'peter-pan-polls';
const VOTES_KEY = 'peter-pan-votes';

// Initialize Redis client
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

// Get all polls
export async function getAllPolls(): Promise<Poll[]> {
  try {
    if (!redis) {
      console.log('Redis not available, returning empty array');
      return [];
    }

    const polls = await redis.get<Poll[]>(POLLS_KEY);
    return polls || [];
  } catch (error) {
    console.error('Error getting polls from Redis:', error);
    return [];
  }
}

// Get active poll
export async function getActivePoll(): Promise<Poll | null> {
  try {
    const polls = await getAllPolls();
    const activePoll = polls.find(p => p.isActive);
    return activePoll || null;
  } catch (error) {
    console.error('Error getting active poll:', error);
    return null;
  }
}

// Create a new poll
export async function createPoll(question: string, options: string[]): Promise<Poll | null> {
  try {
    if (!redis) {
      console.log('Redis not available, cannot create poll');
      return null;
    }

    const polls = await getAllPolls();

    // Deactivate all existing polls
    const updatedPolls = polls.map(p => ({ ...p, isActive: false }));

    // Create new poll
    const newPoll: Poll = {
      id: Date.now().toString(),
      question,
      options: options.map((text, index) => ({
        id: `option-${index}`,
        text,
        votes: 0
      })),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    updatedPolls.push(newPoll);

    await redis.set(POLLS_KEY, updatedPolls);

    console.log('Poll created:', newPoll);
    return newPoll;
  } catch (error) {
    console.error('Error creating poll:', error);
    return null;
  }
}

// Get all votes
export async function getAllVotes(): Promise<Vote[]> {
  try {
    if (!redis) {
      console.log('Redis not available, returning empty array');
      return [];
    }

    const votes = await redis.get<Vote[]>(VOTES_KEY);
    return votes || [];
  } catch (error) {
    console.error('Error getting votes from Redis:', error);
    return [];
  }
}

// Get votes for a specific poll
export async function getPollVotes(pollId: string): Promise<Vote[]> {
  try {
    const allVotes = await getAllVotes();
    return allVotes.filter(v => v.pollId === pollId);
  } catch (error) {
    console.error('Error getting poll votes:', error);
    return [];
  }
}

// Check if user has voted on a poll
export async function hasUserVoted(pollId: string, voterEmail: string): Promise<boolean> {
  try {
    const votes = await getPollVotes(pollId);
    return votes.some(v => v.voterEmail === voterEmail);
  } catch (error) {
    console.error('Error checking if user voted:', error);
    return false;
  }
}

// Submit a vote
export async function submitVote(
  pollId: string,
  voterName: string,
  voterEmail: string,
  optionId: string
): Promise<boolean> {
  try {
    if (!redis) {
      console.log('Redis not available, cannot submit vote');
      return false;
    }

    // Check if user already voted
    const alreadyVoted = await hasUserVoted(pollId, voterEmail);
    if (alreadyVoted) {
      console.log('User already voted on this poll');
      return false;
    }

    // Get all votes and add new vote
    const allVotes = await getAllVotes();
    const newVote: Vote = {
      pollId,
      voterId: Date.now().toString(),
      voterName,
      voterEmail,
      optionId,
      votedAt: new Date().toISOString()
    };

    allVotes.push(newVote);
    await redis.set(VOTES_KEY, allVotes);

    // Update poll vote count
    const polls = await getAllPolls();
    const pollIndex = polls.findIndex(p => p.id === pollId);

    if (pollIndex !== -1) {
      const poll = polls[pollIndex];
      const optionIndex = poll.options.findIndex(o => o.id === optionId);

      if (optionIndex !== -1) {
        poll.options[optionIndex].votes += 1;
        await redis.set(POLLS_KEY, polls);
      }
    }

    console.log('Vote submitted:', newVote);
    return true;
  } catch (error) {
    console.error('Error submitting vote:', error);
    return false;
  }
}

// Get poll results with voter details
export async function getPollResults(pollId: string): Promise<{
  poll: Poll | null;
  votes: Vote[];
  votesByOption: Record<string, Vote[]>;
}> {
  try {
    const polls = await getAllPolls();
    const poll = polls.find(p => p.id === pollId) || null;
    const votes = await getPollVotes(pollId);

    const votesByOption: Record<string, Vote[]> = {};
    votes.forEach(vote => {
      if (!votesByOption[vote.optionId]) {
        votesByOption[vote.optionId] = [];
      }
      votesByOption[vote.optionId].push(vote);
    });

    return { poll, votes, votesByOption };
  } catch (error) {
    console.error('Error getting poll results:', error);
    return { poll: null, votes: [], votesByOption: {} };
  }
}

// Delete a poll and its votes
export async function deletePoll(pollId: string): Promise<boolean> {
  try {
    if (!redis) {
      console.log('Redis not available, cannot delete poll');
      return false;
    }

    // Remove poll
    const polls = await getAllPolls();
    const updatedPolls = polls.filter(p => p.id !== pollId);
    await redis.set(POLLS_KEY, updatedPolls);

    // Remove votes for this poll
    const votes = await getAllVotes();
    const updatedVotes = votes.filter(v => v.pollId !== pollId);
    await redis.set(VOTES_KEY, updatedVotes);

    console.log('Poll deleted:', pollId);
    return true;
  } catch (error) {
    console.error('Error deleting poll:', error);
    return false;
  }
}
