import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { PollList } from "@/components/polls/PollList";

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Create and Vote on Polls
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Engage with your community through interactive polls. Create
              questions, gather opinions, and make data-driven decisions.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/polls/create">Create Poll</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/my-polls">Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose PollApp?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Easy to Use</CardTitle>
                  <CardDescription>
                    Create polls in minutes with our intuitive interface
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    No complex setup required. Just ask your question, add
                    options, and share with your community.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Real-time Results</CardTitle>
                  <CardDescription>
                    See votes and results update in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Watch as responses come in and see live charts and
                    statistics for your polls.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Secure & Private</CardTitle>
                  <CardDescription>
                    Your data is protected with enterprise-grade security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Vote anonymously or with authentication. Your privacy and
                    data security are our top priorities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent Polls Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Recent Polls</h2>
              <Button asChild variant="outline">
                <Link href="/polls">View All</Link>
              </Button>
            </div>
            <PollList />
          </div>
        </section>
      </div>
    </Layout>
  );
}
