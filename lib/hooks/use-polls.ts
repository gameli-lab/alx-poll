"use client"

import { useState, useEffect } from "react"
import { Poll, CreatePollData, VoteData, PollFilters } from "@/lib/types/poll"

export function usePolls(filters?: PollFilters) {
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPolls = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // TODO: Replace with actual API call
      const response = await mockFetchPollsAPI(filters)
      setPolls(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch polls")
    } finally {
      setIsLoading(false)
    }
  }

  const createPoll = async (pollData: CreatePollData): Promise<Poll> => {
    try {
      setIsLoading(true)
      setError(null)
      
      // TODO: Replace with actual API call
      const newPoll = await mockCreatePollAPI(pollData)
      setPolls(prev => [newPoll, ...prev])
      return newPoll
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create poll")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const voteOnPoll = async (voteData: VoteData): Promise<void> => {
    try {
      setError(null)
      
      // TODO: Replace with actual API call
      await mockVoteAPI(voteData)
      
      // Update local state
      setPolls(prev => prev.map(poll => {
        if (poll.id === voteData.pollId) {
          const updatedOptions = poll.options.map(option => {
            if (option.id === voteData.optionId) {
              return { ...option, votes: option.votes + 1 }
            }
            return option
          })
          
          // Recalculate percentages
          const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0)
          const optionsWithPercentages = updatedOptions.map(opt => ({
            ...opt,
            percentage: totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0
          }))
          
          return {
            ...poll,
            options: optionsWithPercentages,
            totalVotes: totalVotes
          }
        }
        return poll
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to vote on poll")
      throw err
    }
  }

  const deletePoll = async (pollId: string): Promise<void> => {
    try {
      setError(null)
      
      // TODO: Replace with actual API call
      await mockDeletePollAPI(pollId)
      
      // Remove from local state
      setPolls(prev => prev.filter(poll => poll.id !== pollId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete poll")
      throw err
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [filters])

  return {
    polls,
    isLoading,
    error,
    fetchPolls,
    createPoll,
    voteOnPoll,
    deletePoll
  }
}

// Mock API functions - replace with actual API calls
async function mockFetchPollsAPI(filters?: PollFilters): Promise<Poll[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const mockPolls: Poll[] = [
    {
      id: "1",
      title: "What's your favorite programming language?",
      description: "Let's see which programming language is most popular among developers in 2024.",
      options: [
        { id: "1", text: "JavaScript", votes: 45, percentage: 28.8 },
        { id: "2", text: "Python", votes: 38, percentage: 24.4 },
        { id: "3", text: "TypeScript", votes: 32, percentage: 20.5 },
        { id: "4", text: "Rust", votes: 25, percentage: 16.0 },
        { id: "5", text: "Go", votes: 16, percentage: 10.3 }
      ],
      totalVotes: 156,
      endDate: "2024-12-31T23:59:59",
      isActive: true,
      createdAt: "2024-01-15T10:00:00",
      createdBy: "user1",
      category: "Technology"
    },
    {
      id: "2",
      title: "Best framework for building web applications?",
      description: "Which framework do you prefer for building modern web applications?",
      options: [
        { id: "6", text: "React", votes: 28, percentage: 31.5 },
        { id: "7", text: "Vue", votes: 22, percentage: 24.7 },
        { id: "8", text: "Angular", votes: 18, percentage: 20.2 },
        { id: "9", text: "Svelte", votes: 12, percentage: 13.5 },
        { id: "10", text: "Next.js", votes: 9, percentage: 10.1 }
      ],
      totalVotes: 89,
      endDate: "2024-12-25T23:59:59",
      isActive: true,
      createdAt: "2024-01-10T14:30:00",
      createdBy: "user2",
      category: "Technology"
    }
  ]
  
  // Apply filters if provided
  let filteredPolls = mockPolls
  
  if (filters?.isActive !== undefined) {
    filteredPolls = filteredPolls.filter(poll => poll.isActive === filters.isActive)
  }
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    filteredPolls = filteredPolls.filter(poll => 
      poll.title.toLowerCase().includes(searchLower) ||
      poll.description.toLowerCase().includes(searchLower)
    )
  }
  
  if (filters?.category) {
    filteredPolls = filteredPolls.filter(poll => poll.category === filters.category)
  }
  
  // Apply sorting
  if (filters?.sortBy) {
    filteredPolls.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (filters.sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'totalVotes':
          aValue = a.totalVotes
          bValue = b.totalVotes
          break
        case 'endDate':
          aValue = new Date(a.endDate).getTime()
          bValue = new Date(b.endDate).getTime()
          break
        default:
          return 0
      }
      
      if (filters.sortOrder === 'desc') {
        return bValue - aValue
      }
      return aValue - bValue
    })
  }
  
  return filteredPolls
}

async function mockCreatePollAPI(pollData: CreatePollData): Promise<Poll> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const newPoll: Poll = {
    id: Date.now().toString(),
    ...pollData,
    options: pollData.options.map((text, index) => ({
      id: (Date.now() + index).toString(),
      text,
      votes: 0,
      percentage: 0
    })),
    totalVotes: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    createdBy: "current-user" // TODO: Get from auth context
  }
  
  return newPoll
}

async function mockVoteAPI(voteData: VoteData): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Simulate potential errors
  if (Math.random() < 0.1) {
    throw new Error("Failed to record vote. Please try again.")
  }
}

async function mockDeletePollAPI(pollId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Simulate potential errors
  if (Math.random() < 0.1) {
    throw new Error("Failed to delete poll. Please try again.")
  }
}
