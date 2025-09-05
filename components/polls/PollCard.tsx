'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Poll } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface PollCardProps {
  poll: Poll;
}

export function PollCard({ poll }: PollCardProps) {
  const isExpired = poll.expiresAt && new Date() > poll.expiresAt;
  const timeLeft = poll.expiresAt 
    ? formatDistanceToNow(poll.expiresAt, { addSuffix: true })
    : null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="line-clamp-2">
                {poll.description}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant={poll.isActive && !isExpired ? 'default' : 'secondary'}>
              {isExpired ? 'Expired' : poll.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {timeLeft && (
              <span className="text-xs text-muted-foreground">
                {timeLeft}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{poll.totalVotes}</span> votes • 
            Created by <span className="font-medium">{poll.author.name}</span>
          </div>
          
          <div className="space-y-2">
            {poll.options.slice(0, 3).map((option) => (
              <div key={option.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{option.text}</span>
                <span className="text-muted-foreground">{option.votes}</span>
              </div>
            ))}
            {poll.options.length > 3 && (
              <div className="text-sm text-muted-foreground">
                +{poll.options.length - 3} more options
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href={`/polls/${poll.id}`}>
                {isExpired ? 'View Results' : 'Vote Now'}
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
