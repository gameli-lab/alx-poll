"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Submits a vote for a given poll option.
 *
 * @param {string} pollId - The ID of the poll.
 * @param {string} optionId - The ID of the option being voted for.
 * @returns {Promise<any>} The newly created vote record if successful.
 * @throws {Error} If the user is not logged in, poll not found, poll inactive, poll expired, or already voted.
 */
export async function submitVote(pollId: string, optionId: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to vote");
  }

  try {
    // Check if the poll is active
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("is_active, expires_at, allow_multiple")
      .eq("id", pollId)
      .single();

    if (pollError) {
      throw new Error(`Failed to fetch poll: ${pollError.message}`);
    }

    if (!poll) {
      throw new Error("Poll not found");
    }

    // Check if poll is active
    if (!poll.is_active) {
      throw new Error("This poll is not active");
    }

    // Check if poll has expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      throw new Error("This poll has expired");
    }

    // Check if user can vote (using database function)
    const { data: canVote, error: canVoteError } = await supabase.rpc(
      "can_user_vote",
      {
        p_poll_id: pollId,
        p_user_id: user.id,
        p_option_id: optionId,
      },
    );

    if (canVoteError) {
      throw new Error(
        `Failed to check voting eligibility: ${canVoteError.message}`,
      );
    }

    if (!canVote) {
      if (!poll.allow_multiple) {
        throw new Error("You have already voted on this poll");
      } else {
        throw new Error("You have already voted for this option");
      }
    }

    // Submit the vote
    const { data: vote, error: voteError } = await supabase
      .from("votes")
      .insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: user.id,
      })
      .select()
      .single();

    if (voteError) {
      throw new Error(`Failed to submit vote: ${voteError.message}`);
    }

    // Revalidate the poll page to show updated results
    revalidatePath(`/polls/${pollId}`);
    revalidatePath("/polls");

    return vote;
  } catch (error) {
    console.error("Error submitting vote:", error);
    throw error;
  }
}

/**
 * Removes a user's vote from a specific poll option.
 *
 * @param {string} pollId - The ID of the poll.
 * @param {string} optionId - The ID of the option from which the vote is being removed.
 * @returns {Promise<{ success: boolean }>} An object indicating success.
 * @throws {Error} If the user is not logged in or failed to remove the vote.
 */
export async function removeVote(pollId: string, optionId: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to remove a vote");
  }

  try {
    // Remove the vote
    const { error: deleteError } = await supabase
      .from("votes")
      .delete()
      .eq("poll_id", pollId)
      .eq("option_id", optionId)
      .eq("user_id", user.id);

    if (deleteError) {
      throw new Error(`Failed to remove vote: ${deleteError.message}`);
    }

    // Revalidate the poll page to show updated results
    revalidatePath(`/polls/${pollId}`);
    revalidatePath("/polls");

    return { success: true };
  } catch (error) {
    console.error("Error removing vote:", error);
    throw error;
  }
}

/**
 * Retrieves the IDs of options an authenticated user has voted for in a specific poll.
 *
 * @param {string} pollId - The ID of the poll.
 * @returns {Promise<string[]>} An array of option IDs the user has voted for, or an empty array if not logged in or no votes found.
 * @throws {Error} If failed to fetch user votes.
 */
export async function getUserVotes(pollId: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  try {
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select("option_id")
      .eq("poll_id", pollId)
      .eq("user_id", user.id);

    if (votesError) {
      throw new Error(`Failed to fetch user votes: ${votesError.message}`);
    }

    return votes?.map((vote) => vote.option_id) || [];
  } catch (error) {
    console.error("Error fetching user votes:", error);
    return [];
  }
}
