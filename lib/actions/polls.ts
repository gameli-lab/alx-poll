"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

/**
 * Fetches a single poll by its ID, including its options and author details.
 * This is a server action to be used in Server Components or other Server Actions.
 *
 * @param {string} pollId - The ID of the poll to fetch.
 * @returns {Promise<Database['public']['Tables']['polls']['Row'] & { options: Database['public']['Tables']['poll_options']['Row'][], author_email: string | null, author_name: string | null, author_avatar: string | null } | null>}
 *   The poll object with its options and author details, or null if not found.
 */
export async function getPollById(pollId: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: poll, error } = await supabase
    .from("polls_with_author") // Using the view to get author details
    .select("*, poll_options(*)") // Select poll, author details from view, and all its options
    .eq("id", pollId)
    .single();

  if (error) {
    console.error("Error fetching poll by ID:", error.message);
    // Depending on desired error handling, might throw or return null
    return null;
  }

  return poll;
}
