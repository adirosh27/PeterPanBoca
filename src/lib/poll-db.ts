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
  eventDate?: string | null;
  deadline?: string | null;
  allowMultipleAnswers?: boolean;
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
  optionIds?: string[]; // For multiple answer support
  votedAt: string;
  wasChanged?: boolean;
  comment?: string;
  ipAddress?: string;
  previousIpAddress?: string; // Track if IP changed when vote was modified
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
export async function createPoll(question: string, options: string[], eventDate?: string | null, deadline?: string | null, allowMultipleAnswers?: boolean): Promise<Poll | null> {
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
      eventDate: eventDate || null,
      deadline: deadline || null,
      allowMultipleAnswers: allowMultipleAnswers || false,
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
  optionId: string | string[],
  comment?: string,
  ipAddress?: string
): Promise<boolean> {
  try {
    if (!redis) {
      console.log('Redis not available, cannot submit vote');
      return false;
    }

    // Get all votes
    const allVotes = await getAllVotes();

    // Check if user already voted
    const existingVoteIndex = allVotes.findIndex(
      v => v.pollId === pollId && v.voterEmail === voterEmail
    );

    // Convert optionId to array format if it's a single value
    const optionIds = Array.isArray(optionId) ? optionId : [optionId];
    const primaryOptionId = optionIds[0];

    if (existingVoteIndex !== -1) {
      // User is changing their vote
      const oldOptionIds = allVotes[existingVoteIndex].optionIds || [allVotes[existingVoteIndex].optionId];
      const existingVote = allVotes[existingVoteIndex];

      // Track if IP changed
      const ipChanged = ipAddress && existingVote.ipAddress && ipAddress !== existingVote.ipAddress;

      // Update the vote
      allVotes[existingVoteIndex] = {
        ...existingVote,
        optionId: primaryOptionId,
        optionIds: optionIds,
        votedAt: new Date().toISOString(),
        wasChanged: true,
        comment: comment !== undefined ? comment : existingVote.comment,
        ipAddress: ipAddress || existingVote.ipAddress,
        previousIpAddress: ipChanged ? existingVote.ipAddress : existingVote.previousIpAddress
      };

      await redis.set(VOTES_KEY, allVotes);

      // Update poll vote counts (decrease old options, increase new options)
      const polls = await getAllPolls();
      const pollIndex = polls.findIndex(p => p.id === pollId);

      if (pollIndex !== -1) {
        const poll = polls[pollIndex];

        // Decrease old option counts
        oldOptionIds.forEach(oldId => {
          const oldOptionIndex = poll.options.findIndex(o => o.id === oldId);
          if (oldOptionIndex !== -1 && poll.options[oldOptionIndex].votes > 0) {
            poll.options[oldOptionIndex].votes -= 1;
          }
        });

        // Increase new option counts
        optionIds.forEach(newId => {
          const newOptionIndex = poll.options.findIndex(o => o.id === newId);
          if (newOptionIndex !== -1) {
            poll.options[newOptionIndex].votes += 1;
          }
        });

        await redis.set(POLLS_KEY, polls);
      }
    } else {
      // New vote
      const newVote: Vote = {
        pollId,
        voterId: Date.now().toString(),
        voterName,
        voterEmail,
        optionId: primaryOptionId,
        optionIds: optionIds,
        votedAt: new Date().toISOString(),
        comment: comment || undefined,
        ipAddress: ipAddress || undefined
      };

      allVotes.push(newVote);
      await redis.set(VOTES_KEY, allVotes);

      // Update poll vote counts for all selected options
      const polls = await getAllPolls();
      const pollIndex = polls.findIndex(p => p.id === pollId);

      if (pollIndex !== -1) {
        const poll = polls[pollIndex];

        // Increase count for each selected option
        optionIds.forEach(selectedId => {
          const optionIndex = poll.options.findIndex(o => o.id === selectedId);
          if (optionIndex !== -1) {
            poll.options[optionIndex].votes += 1;
          }
        });

        await redis.set(POLLS_KEY, polls);
      }
    }

    console.log('Vote submitted successfully');
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
      // For multiple answer polls, add the vote to all selected options
      const selectedOptions = vote.optionIds || [vote.optionId];
      selectedOptions.forEach(optionId => {
        if (!votesByOption[optionId]) {
          votesByOption[optionId] = [];
        }
        votesByOption[optionId].push(vote);
      });
    });

    return { poll, votes, votesByOption };
  } catch (error) {
    console.error('Error getting poll results:', error);
    return { poll: null, votes: [], votesByOption: {} };
  }
}

// Check if a vote has suspicious IP activity
export function isSuspiciousVote(vote: Vote): boolean {
  // Vote is suspicious if:
  // 1. It was changed AND the IP address changed
  return !!(vote.wasChanged && vote.previousIpAddress && vote.ipAddress !== vote.previousIpAddress);
}

// Get suspicious votes for a poll
export async function getSuspiciousVotes(pollId: string): Promise<Vote[]> {
  try {
    const votes = await getPollVotes(pollId);
    return votes.filter(isSuspiciousVote);
  } catch (error) {
    console.error('Error getting suspicious votes:', error);
    return [];
  }
}

// Delete a user's vote
export async function deleteVote(pollId: string, voterEmail: string): Promise<boolean> {
  try {
    if (!redis) {
      console.log('Redis not available, cannot delete vote');
      return false;
    }

    // Get all votes
    const allVotes = await getAllVotes();

    // Find the vote to delete
    const voteIndex = allVotes.findIndex(
      v => v.pollId === pollId && v.voterEmail === voterEmail
    );

    if (voteIndex === -1) {
      console.log('Vote not found');
      return false;
    }

    const voteToDelete = allVotes[voteIndex];
    const optionIds = voteToDelete.optionIds || [voteToDelete.optionId];

    // Remove the vote from array
    allVotes.splice(voteIndex, 1);
    await redis.set(VOTES_KEY, allVotes);

    // Update poll vote counts (decrease for all selected options)
    const polls = await getAllPolls();
    const pollIndex = polls.findIndex(p => p.id === pollId);

    if (pollIndex !== -1) {
      const poll = polls[pollIndex];

      // Decrease count for each selected option
      optionIds.forEach(optionId => {
        const optionIndex = poll.options.findIndex(o => o.id === optionId);
        if (optionIndex !== -1 && poll.options[optionIndex].votes > 0) {
          poll.options[optionIndex].votes -= 1;
        }
      });

      await redis.set(POLLS_KEY, polls);
    }

    console.log('Vote deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting vote:', error);
    return false;
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
