"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PollCard } from "@/components/polls/poll-card"
import { Plus, BarChart3, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

// Sample data - replace with actual API calls
const userPolls = [
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
  }
]

const participatedPolls = [
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

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your polls and track your activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPolls.length}</div>
            <p className="text-xs text-muted-foreground">Polls created</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPolls.filter(p => p.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPolls.reduce((sum, p) => sum + p.totalVotes, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all polls</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participated</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participatedPolls.length}</div>
            <p className="text-xs text-muted-foreground">Polls voted in</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Create a new poll or browse existing ones</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button asChild>
            <Link href="/polls/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Poll
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/polls">Browse All Polls</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Tabs for different poll views */}
      <Tabs defaultValue="my-polls" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-polls">My Polls</TabsTrigger>
          <TabsTrigger value="participated">Participated</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-polls" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userPolls.map((poll) => (
              <PollCard
                key={poll.id}
                {...poll}
                onVote={(id) => console.log("Voting on poll:", id)}
                onView={() => console.log("Viewing poll:", poll.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="participated" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {participatedPolls.map((poll) => (
              <PollCard
                key={poll.id}
                {...poll}
                onVote={(id) => console.log("Voting on poll:", id)}
                onView={() => console.log("Viewing poll:", poll.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
