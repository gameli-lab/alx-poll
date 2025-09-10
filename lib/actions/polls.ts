'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { CreatePollForm } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function createPoll(formData: CreatePollForm) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('You must be logged in to create a poll');
  }

  // Validate form data
  if (!formData.title?.trim()) {
    throw new Error('Poll title is required');
  }

  if (!formData.options || formData.options.length < 2) {
    throw new Error('At least 2 options are required');
  }

  const validOptions = formData.options.filter(option => option.trim() !== '');
  if (validOptions.length < 2) {
    throw new Error('At least 2 valid options are required');
  }

  try {
    // Start a transaction by creating the poll first
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        author_id: user.id,
        is_active: true,
        allow_multiple: formData.allowMultiple || false,
        expires_at: formData.expiresAt?.toISOString() || null,
      })
      .select()
      .single();

    if (pollError) {
      throw new Error(`Failed to create poll: ${pollError.message}`);
    }

    // Create poll options
    const optionsData = validOptions.map(option => ({
      poll_id: poll.id,
      text: option.trim(),
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsData);

    if (optionsError) {
      // If options creation fails, we should clean up the poll
      await supabase.from('polls').delete().eq('id', poll.id);
      throw new Error(`Failed to create poll options: ${optionsError.message}`);
    }

    // Revalidate the polls page to show the new poll
    revalidatePath('/polls');
    revalidatePath('/polls/create');

    return {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      author_id: poll.author_id,
      is_active: poll.is_active,
      allow_multiple: poll.allow_multiple,
      expires_at: poll.expires_at,
      created_at: poll.created_at,
      updated_at: poll.updated_at,
      total_votes: poll.total_votes,
    };
  } catch (error) {
    console.error('Error creating poll:', error);
    throw error;
  }
}

export async function getPollById(id: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  try {
    // Get poll with author information
    const { data: poll, error: pollError } = await supabase
      .from('polls_with_author')
      .select('*')
      .eq('id', id)
      .single();

    if (pollError) {
      throw new Error(`Failed to fetch poll: ${pollError.message}`);
    }

    if (!poll) {
      throw new Error('Poll not found');
    }

    // Get poll options
    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .select('*')
      .eq('poll_id', id)
      .order('created_at', { ascending: true });

    if (optionsError) {
      throw new Error(`Failed to fetch poll options: ${optionsError.message}`);
    }

    return {
      ...poll,
      options: options || [],
    };
  } catch (error) {
    console.error('Error fetching poll:', error);
    throw error;
  }
}

export async function getPolls(filters?: {
  search?: string;
  author?: string;
  isActive?: boolean;
  sortBy?: 'created_at' | 'total_votes' | 'title';
  sortOrder?: 'asc' | 'desc';
  currentUserOnly?: boolean;
}) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  try {
    let query = supabase
      .from('polls_with_author')
      .select('*');

    // Apply filters
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.author) {
      query = query.eq('author_id', filters.author);
    }

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    // Filter for current user only
    if (filters?.currentUserOnly) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        query = query.eq('author_id', user.id);
      } else {
        return []; // Return empty array if no user
      }
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'created_at';
    const sortOrder = filters?.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data: polls, error: pollsError } = await query;

    if (pollsError) {
      throw new Error(`Failed to fetch polls: ${pollsError.message}`);
    }

    // Get options for each poll
    const pollsWithOptions = await Promise.all(
      (polls || []).map(async (poll) => {
        const { data: options, error: optionsError } = await supabase
          .from('poll_options')
          .select('*')
          .eq('poll_id', poll.id)
          .order('created_at', { ascending: true });

        if (optionsError) {
          console.error(`Failed to fetch options for poll ${poll.id}:`, optionsError);
          return { ...poll, options: [] };
        }

        return { ...poll, options: options || [] };
      })
    );

    return pollsWithOptions;
  } catch (error) {
    console.error('Error fetching polls:', error);
    throw error;
  }
}

export async function updatePoll(pollId: string, formData: Partial<CreatePollForm>) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('You must be logged in to update a poll');
  }

  try {
    // Check if the user owns this poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('author_id')
      .eq('id', pollId)
      .single();

    if (pollError) {
      throw new Error(`Failed to fetch poll: ${pollError.message}`);
    }

    if (!poll) {
      throw new Error('Poll not found');
    }

    if (poll.author_id !== user.id) {
      throw new Error('You can only update your own polls');
    }

    // Update poll data
    const pollUpdateData: Record<string, unknown> = {};
    if (formData.title !== undefined) pollUpdateData.title = formData.title.trim();
    if (formData.description !== undefined) pollUpdateData.description = formData.description?.trim() || null;
    if (formData.allowMultiple !== undefined) pollUpdateData.allow_multiple = formData.allowMultiple;
    if (formData.expiresAt !== undefined) pollUpdateData.expires_at = formData.expiresAt?.toISOString() || null;

    if (Object.keys(pollUpdateData).length > 0) {
      const { error: updateError } = await supabase
        .from('polls')
        .update(pollUpdateData)
        .eq('id', pollId);

      if (updateError) {
        throw new Error(`Failed to update poll: ${updateError.message}`);
      }
    }

    // Update options if provided
    if (formData.options && formData.options.length > 0) {
      const validOptions = formData.options.filter(option => option.trim() !== '');
      
      if (validOptions.length >= 2) {
        // Delete existing options
        const { error: deleteOptionsError } = await supabase
          .from('poll_options')
          .delete()
          .eq('poll_id', pollId);

        if (deleteOptionsError) {
          throw new Error(`Failed to delete existing options: ${deleteOptionsError.message}`);
        }

        // Insert new options
        const optionsData = validOptions.map(option => ({
          poll_id: pollId,
          text: option.trim(),
        }));

        const { error: insertOptionsError } = await supabase
          .from('poll_options')
          .insert(optionsData);

        if (insertOptionsError) {
          throw new Error(`Failed to insert new options: ${insertOptionsError.message}`);
        }
      }
    }

    // Revalidate the polls page
    revalidatePath('/polls');
    revalidatePath('/my-polls');
    revalidatePath(`/polls/${pollId}`);

    return { success: true };
  } catch (error) {
    console.error('Error updating poll:', error);
    throw error;
  }
}

export async function deletePoll(pollId: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('You must be logged in to delete a poll');
  }

  try {
    // Check if the user owns this poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('author_id')
      .eq('id', pollId)
      .single();

    if (pollError) {
      throw new Error(`Failed to fetch poll: ${pollError.message}`);
    }

    if (!poll) {
      throw new Error('Poll not found');
    }

    if (poll.author_id !== user.id) {
      throw new Error('You can only delete your own polls');
    }

    // Delete the poll (cascade will handle options and votes)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId);

    if (deleteError) {
      throw new Error(`Failed to delete poll: ${deleteError.message}`);
    }

    // Revalidate the polls page
    revalidatePath('/polls');
    revalidatePath('/my-polls');
    revalidatePath(`/polls/${pollId}`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting poll:', error);
    throw error;
  }
}
