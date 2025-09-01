import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PollCard } from "@/components/polls/poll-card"
import { Plus, BarChart3, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getUserPolls } from "@/lib/actions/polls"
import { Poll } from "@/lib/types/poll"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

async function DashboardContent() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the user's profile to get the full name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user!.id) // user is guaranteed to exist because of the check in DashboardPage
    .single();

  const userPolls = await getUserPolls();
  // For now, we'll use empty array for participated polls
  const participatedPolls: Poll[] = [];

  const activePolls = userPolls.filter(p => p.status === 'active')
  const totalVotes = userPolls.reduce((sum, p) => sum + p.total_votes, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {profile?.full_name || profile?.email}! Manage your polls and track your activity.
        </p>
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
            <div className="text-2xl font-bold">{activePolls.length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes}</div>
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
          {userPolls.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No polls yet</h3>
                <p className="text-gray-600 mb-6">
                  Start engaging your community by creating your first poll!
                </p>
                <Button asChild>
                  <Link href="/polls/create">Create Your First Poll</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userPolls.map((poll) => <PollCard key={poll.id} {...poll} />)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="participated" className="space-y-4">
          {participatedPolls.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No participation yet</h3>
                <p className="text-gray-600 mb-6">
                  Start voting on polls to see your participation history here!
                </p>
                <Button asChild>
                  <Link href="/polls">Browse Polls</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {participatedPolls.map((poll) => <PollCard key={poll.id} {...poll} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <DashboardContent />
  )
}
