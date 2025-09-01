"use client"

import { PollCard } from "@/components/polls/poll-card"
import { Poll } from "@/lib/types/poll"

interface PollListProps {
  polls: Poll[]
}

export function PollList({ polls }: PollListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => <PollCard key={poll.id} {...poll} />)}
    </div>
  )
}