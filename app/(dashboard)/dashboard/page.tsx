'use client'

import { PollCard } from "@/components/polls/poll-card"
import { usePolls } from "@/lib/hooks/use-polls"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function DashboardPage() {
  const { polls, isLoading, error } = usePolls()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Polls</h1>
        <Button asChild>
          <Link href="/polls/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Poll
          </Link>
        </Button>
      </div>

      {isLoading && <div>Loading polls...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {polls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map(poll => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No polls yet</h2>
          <p className="text-gray-500 mt-2">Get started by creating your first poll.</p>
          <Button asChild className="mt-4">
            <Link href="/polls/create">Create Poll</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
