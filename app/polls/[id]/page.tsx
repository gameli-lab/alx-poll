import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Users, BarChart3 } from "lucide-react"

// Sample poll data - replace with actual API call
const samplePoll = {
  id: "1",
  title: "What's your favorite programming language?",
  description: "Let's see which programming language is most popular among developers in 2024. This poll will help us understand current trends in the developer community.",
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
  createdAt: "2024-01-15T10:00:00"
}

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const poll = samplePoll // In real app, fetch poll by params.id

  const handleVote = (optionId: string) => {
    // TODO: Implement voting logic
    console.log("Voting for option:", optionId)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant={poll.isActive ? "default" : "secondary"}>
              {poll.isActive ? "Active" : "Closed"}
            </Badge>
            <span className="text-sm text-gray-500">
              Created {new Date(poll.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{poll.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{poll.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Ends: {new Date(poll.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{poll.totalVotes} votes</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>{poll.options.length} options</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Poll Options</CardTitle>
            <CardDescription>Select your preferred option</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {poll.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-sm text-gray-500">
                    {option.votes} votes ({option.percentage}%)
                  </span>
                </div>
                <Progress value={option.percentage} className="h-2" />
                {poll.isActive && (
                  <Button
                    onClick={() => handleVote(option.id)}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Vote for this option
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
