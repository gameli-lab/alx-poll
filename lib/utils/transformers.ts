import { Poll, PollOption, Vote, PollWithDetails, PollOptionWithDetails, VoteWithDetails, User } from '@/lib/types';

/**
 * Transform database poll data to application format
 */
export function transformPoll(poll: Poll, options: PollOption[], author: User): PollWithDetails {
  return {
    ...poll,
    options: options.map(transformPollOption),
    author,
    isActive: poll.is_active,
    allowMultiple: poll.allow_multiple,
    expiresAt: poll.expires_at ? new Date(poll.expires_at) : undefined,
    createdAt: new Date(poll.created_at),
    updatedAt: new Date(poll.updated_at),
    totalVotes: poll.total_votes,
  };
}

/**
 * Transform database poll option data to application format
 */
export function transformPollOption(option: PollOption): PollOptionWithDetails {
  return {
    ...option,
    pollId: option.poll_id,
    createdAt: new Date(option.created_at),
    updatedAt: new Date(option.updated_at),
  };
}

/**
 * Transform database vote data to application format
 */
export function transformVote(vote: Vote): VoteWithDetails {
  return {
    ...vote,
    pollId: vote.poll_id,
    optionId: vote.option_id,
    userId: vote.user_id,
    createdAt: new Date(vote.created_at),
  };
}

/**
 * Transform application poll data to database format
 */
export function transformPollForDatabase(poll: Partial<PollWithDetails>): Partial<Poll> {
  return {
    title: poll.title,
    description: poll.description,
    author_id: poll.author_id,
    is_active: poll.isActive ?? poll.is_active,
    allow_multiple: poll.allowMultiple ?? poll.allow_multiple,
    expires_at: poll.expiresAt?.toISOString(),
  };
}

/**
 * Transform application poll option data to database format
 */
export function transformPollOptionForDatabase(option: Partial<PollOptionWithDetails>): Partial<PollOption> {
  return {
    poll_id: option.pollId ?? option.poll_id,
    text: option.text,
  };
}

/**
 * Transform application vote data to database format
 */
export function transformVoteForDatabase(vote: Partial<VoteWithDetails>): Partial<Vote> {
  return {
    poll_id: vote.pollId ?? vote.poll_id,
    option_id: vote.optionId ?? vote.option_id,
    user_id: vote.userId ?? vote.user_id,
  };
}
