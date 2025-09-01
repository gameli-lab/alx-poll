import { User } from "./auth";

export interface Poll {
  id: string
  title: string
  description?: string
  creator_id: string
  creator?: User
  status: 'active' | 'closed' | 'draft'
  end_date?: string
  is_public: boolean
  allow_multiple_votes: boolean
  created_at: string
  updated_at: string
  options: PollOption[]
  total_votes: number
  user_has_voted: boolean
}

export interface PollOption {
  id: string
  poll_id: string
  text: string
  order_index: number
  created_at: string
  vote_count: number
}

export interface Vote {
  id: string
  poll_id: string
  option_id: string
  voter_id: string
  created_at: string
}

export interface PollFilters {
  category?: string
  isActive?: boolean
  search?: string
  sortBy?: 'createdAt' | 'totalVotes' | 'endDate'
  sortOrder?: 'asc' | 'desc'
}
