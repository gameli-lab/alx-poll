export interface Poll {
  id: string
  title: string
  description: string
  options: PollOption[]
  totalVotes: number
  endDate: string
  isActive: boolean
  createdAt: string
  createdBy: string
  category?: string
  tags?: string[]
}

export interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

export interface CreatePollData {
  title: string
  description: string
  options: string[]
  endDate: string
  category?: string
  tags?: string[]
}

export interface VoteData {
  pollId: string
  optionId: string
}

export interface PollFilters {
  category?: string
  isActive?: boolean
  search?: string
  sortBy?: 'createdAt' | 'totalVotes' | 'endDate'
  sortOrder?: 'asc' | 'desc'
}
