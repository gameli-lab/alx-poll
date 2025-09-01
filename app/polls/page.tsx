import { getPolls } from "@/lib/actions/polls"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PollList } from "@/components/polls/poll-list"

export default async function PollsPage() {
  const polls = await getPolls()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Polls</h1>
          <p className="text-gray-600">Discover what the community is voting on</p>
        </div>
        
        <Button asChild>
          <Link href="/polls/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Poll
          </Link>
        </Button>
      </div>
      
      {polls.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No polls yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to create a poll and start engaging with the community!
            </p>
            <Button asChild>
              <Link href="/polls/create">Create Your First Poll</Link>
            </Button>
          </div>
        </div>
      ) : (
        <PollList polls={polls} />
      )}
    </div>
  )
}
