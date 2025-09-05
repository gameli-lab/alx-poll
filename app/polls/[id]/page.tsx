'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { usePolls } from '@/lib/hooks/usePolls';
import { formatDistanceToNow } from 'date-fns';

export default function PollDetailPage() {
  const params = useParams();
  const pollId = params.id as string;
  const { polls, voteOnPoll } = usePolls();
  
  const poll = polls.find(p => p.id === pollId);

  if (!poll) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Poll not found</h1>
            <p className="text-muted-foreground mt-2">
              The poll you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const isExpired = poll.expiresAt && new Date() > poll.expiresAt;
  const timeLeft = poll.expiresAt 
    ? formatDistanceToNow(poll.expiresAt, { addSuffix: true })
    : null;

  const handleVote = async (optionId: string) => {
    try {
      await voteOnPoll(poll.id, optionId);
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{poll.title}</h1>
            {poll.description && (
              <p className="text-lg text-muted-foreground">{poll.description}</p>
            )}
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>By {poll.author.name}</span>
              <span>•</span>
              <span>{poll.totalVotes} votes</span>
              {timeLeft && (
                <>
                  <span>•</span>
                  <span>{timeLeft}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <Badge variant={poll.isActive && !isExpired ? 'default' : 'secondary'}>
                {isExpired ? 'Expired' : poll.isActive ? 'Active' : 'Inactive'}
              </Badge>
              {poll.allowMultiple && (
                <Badge variant="outline">Multiple choice</Badge>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Poll Options</CardTitle>
              <CardDescription>
                {isExpired ? 'Final results' : 'Cast your vote'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {poll.options.map((option) => {
                const percentage = poll.totalVotes > 0 
                  ? Math.round((option.votes / poll.totalVotes) * 100)
                  : 0;

                return (
                  <div key={option.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.text}</span>
                      <span className="text-sm text-muted-foreground">
                        {option.votes} votes ({percentage}%)
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    
                    {!isExpired && poll.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(option.id)}
                        className="w-full"
                      >
                        Vote for this option
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
