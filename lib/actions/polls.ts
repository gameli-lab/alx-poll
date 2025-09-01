'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { PollOption, Vote } from '@/lib/types/poll'

export async function createPoll(formData: FormData) {
  const supabase = createServerClient()
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { error: 'You must be logged in to create a poll' }
    }

    // Ensure a profile exists for the user, creating one if it doesn't.
    // This is crucial because polls.creator_id has a foreign key to profiles.id.
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('Error checking for profile:', profileError)
      return { error: 'Failed to check user profile.' }
    }

    if (!profile) {
      if (!user.email) {
        return { error: 'User email is not available to create a profile.' }
      }

      const { error: createProfileError } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      })

      if (createProfileError) {
        console.error('Error creating profile for user:', createProfileError)
        return { error: 'Failed to create user profile for poll creation.' }
      }
    }

    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const endDate = formData.get('endDate') as string
    const isPublic = formData.get('isPublic') === 'true'
    const allowMultipleVotes = formData.get('allowMultipleVotes') === 'true'
    const category = formData.get('category') as string
    const options = formData.getAll('options') as string[]

    // Validation
    if (!title.trim()) {
      return { error: 'Poll title is required' }
    }

    if (!category?.trim()) {
      return { error: 'Poll category is required' }
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
        status: 'active',
        category: category.trim()
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
  const supabase = createServerClient()

  try {
    // We need the user to check if they have voted on a poll
    const { data: { user } } = await supabase.auth.getUser()

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
    return polls.map(p => {
      const { votes, ...pollData } = p
      const userHasVoted = user ? (votes as {voter_id: string}[]).some((vote) => vote.voter_id === user.id) : false
      return {
        ...pollData,
        options: pollData.options || [],
        total_votes: Array.isArray(votes) ? votes.length : 0,
        user_has_voted: userHasVoted
      }
    })
  } catch (error) {
    console.error('Error in getPolls:', error)
    return []
  }
}

export async function getPollById(id: string) {
  const supabase = createServerClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()

    const { data: poll, error } = await supabase
      .from('polls')
      .select(`
        *,
        creator:profiles!polls_creator_id_fkey(full_name, email),
        options:poll_options(*),
        votes(*)
      `)
      .eq('id', id)
      .single()

    if (error || !poll) {
      console.error('Error fetching poll:', error)
      return null
    }

    const { votes, ...pollData } = poll

    const voteCounts = (votes as Vote[])?.reduce((acc: Record<string, number>, vote: Vote) => {
      acc[vote.option_id] = (acc[vote.option_id] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const optionsWithVotes = (pollData.options as PollOption[]).map((option: PollOption) => ({
      ...option,
      vote_count: voteCounts[option.id] || 0
    }))

    const userHasVoted = user ? (votes as Vote[]).some((vote) => vote.voter_id === user.id) : false

    return {
      ...pollData,
      options: optionsWithVotes,
      total_votes: votes.length,
      user_has_voted: userHasVoted
    }
  } catch (error) {
    console.error('Error in getPollById:', error)
    return null
  }
}

export async function getUserPolls() {
  const supabase = createServerClient()
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return []
    }

    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        *,
        options:poll_options(*),
        votes(voter_id)
      `)
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user polls:', error)
      return []
    }

    // Transform the data to add total_votes and user_has_voted, avoiding N+1 queries
    return polls.map(p => {
      const { votes, ...pollData } = p
      const userHasVoted = (votes as {voter_id: string}[]).some((vote) => vote.voter_id === user.id)
      return {
        ...pollData,
        options: pollData.options || [],
        total_votes: Array.isArray(votes) ? votes.length : 0,
        user_has_voted: userHasVoted
      }
    })
  } catch (error) {
    console.error('Error in getUserPolls:', error)
    return []
  }
}

export async function deletePoll(pollId: string) {
  const supabase = createServerClient()
  
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
