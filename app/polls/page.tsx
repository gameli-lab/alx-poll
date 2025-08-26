"use client"

import { PollCard } from "@/components/polls/poll-card"

// Sample data - replace with actual API calls
const samplePolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see which programming language is most popular among developers in 2024.",
    options: ["JavaScript", "Python", "TypeScript", "Rust", "Go"],
    totalVotes: 156,
    endDate: "2024-12-31T23:59:59",
    isActive: true
  },
  {
    id: "2",
    title: "Best framework for building web applications?",
    description: "Which framework do you prefer for building modern web applications?",
    options: ["React", "Vue", "Angular", "Svelte", "Next.js"],
    totalVotes: 89,
    endDate: "2024-12-25T23:59:59",
    isActive: true
  },
  {
    id: "3",
    title: "Preferred database for new projects?",
    description: "What database technology would you choose for a new project?",
    options: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Redis"],
    totalVotes: 234,
    endDate: "2024-12-20T23:59:59",
    isActive: false
  }
]

export default function PollsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Polls</h1>
        <p className="text-gray-600">Discover what the community is voting on</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {samplePolls.map((poll) => (
          <PollCard
            key={poll.id}
            {...poll}
            onVote={(id) => console.log("Voting on poll:", id)}
            onView={() => console.log("Viewing poll:", poll.id)}
          />
        ))}
      </div>
    </div>
  )
}
