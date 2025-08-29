'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CreatePollData, Poll, PollOption } from '@/lib/types/poll'

export async function createPoll(formData: FormData) {
  const supabase = createServerSupabaseClient()
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { error: 'You must be logged in to create a poll' }
    }

    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const endDate = formData.get('endDate') as string
    const isPublic = formData.get('isPublic') === 'true'
    const allowMultipleVotes = formData.get('allowMultipleVotes') === 'true'
    const options = formData.getAll('options') as string[]

    // Validation
    if (!title.trim()) {
      return { error: 'Poll title is required' }
    }
    
    if (options.length < 2) {
      return { error: 'At least 2 options are required' }
    }

    // Filter out empty options
    const validOptions = options.filter(option => option.trim().length > 0)
    
    if (validOptions.length < 2) {
      return { error: 'At least 2 valid options are required' }
    }

    // Create poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        creator_id: user.id,
        end_date: endDate || null,
        is_public: isPublic,
        allow_multiple_votes: allowMultipleVotes,
        status: 'active'
      })
      .select()
      .single()

    if (pollError) {
      console.error('Error creating poll:', pollError)
      return { error: 'Failed to create poll' }
    }

    // Create poll options
    const pollOptions = validOptions.map((text, index) => ({
      poll_id: poll.id,
      text: text.trim(),
      order_index: index
    }))

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions)

    if (optionsError) {
      console.error('Error creating poll options:', optionsError)
      // Clean up the poll if options creation fails
      await supabase.from('polls').delete().eq('id', poll.id)
      return { error: 'Failed to create poll options' }
    }

    revalidatePath('/polls')
    revalidatePath('/dashboard')
    redirect(`/polls/${poll.id}`)
  } catch (error) {
    console.error('Error in createPoll:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function getPolls() {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        *,
        creator:profiles!polls_creator_id_fkey(full_name, email),
        options:poll_options(*),
        votes(voter_id)
      `)
      .eq('is_public', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching polls:', error)
      return []
    }

    // Transform the data to match our Poll interface
    return polls.map(poll => ({
      ...poll,
      total_votes: poll.votes?.length || 0,
      user_has_voted: false // This will be updated based on current user
    }))
  } catch (error) {
    console.error('Error in getPolls:', error)
    return []
  }
}

export async function getPollById(id: string) {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: poll, error } = await supabase
      .from('polls')
      .select(`
        *,
        creator:profiles!polls_creator_id_fkey(full_name, email),
        options:poll_options(*)
      `)
      .eq('id', id)
      .eq('is_public', true)
      .single()

    if (error) {
      console.error('Error fetching poll:', error)
      return null
    }

    // Get vote counts for each option
    const { data: votes } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', id)

    const voteCounts = votes?.reduce((acc, vote) => {
      acc[vote.option_id] = (acc[vote.option_id] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Transform options with vote counts
    const optionsWithVotes = poll.options.map(option => ({
      ...option,
      vote_count: voteCounts[option.id] || 0
    }))

    return {
      ...poll,
      options: optionsWithVotes,
      total_votes: Object.values(voteCounts).reduce((sum, count) => sum + count, 0)
    }
  } catch (error) {
    console.error('Error in getPollById:', error)
    return null
  }
}

export async function getUserPolls() {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return []
    }

    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        *,
        options:poll_options(*)
      `)
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user polls:', error)
      return []
    }

    // Get vote counts for each poll
    const pollsWithVotes = await Promise.all(
      polls.map(async (poll) => {
        const { data: votes } = await supabase
          .from('votes')
          .select('id')
          .eq('poll_id', poll.id)

        return {
          ...poll,
          total_votes: votes?.length || 0
        }
      })
    )

    return pollsWithVotes
  } catch (error) {
    console.error('Error in getUserPolls:', error)
    return []
  }
}

export async function deletePoll(pollId: string) {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { error: 'You must be logged in to delete a poll' }
    }

    // Check if user owns the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('creator_id')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      return { error: 'Poll not found' }
    }

    if (poll.creator_id !== user.id) {
      return { error: 'You can only delete your own polls' }
    }

    // Delete the poll (cascading will handle options and votes)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (deleteError) {
      console.error('Error deleting poll:', deleteError)
      return { error: 'Failed to delete poll' }
    }

    revalidatePath('/polls')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error in deletePoll:', error)
    return { error: 'An unexpected error occurred' }
  }
}
