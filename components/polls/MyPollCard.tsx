'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { deletePoll } from '@/lib/actions/polls';
import { useRouter } from 'next/navigation';

interface MyPollCardProps {
  poll: Record<string, unknown>;
}

export function MyPollCard({ poll }: MyPollCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const isExpired = (poll.expires_at as string) && new Date() > new Date(poll.expires_at as string);
  const timeLeft = (poll.expires_at as string) 
    ? formatDistanceToNow(new Date(poll.expires_at as string), { addSuffix: true })
    : null;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePoll(poll.id as string);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete poll:', error);
      alert('Failed to delete poll. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    const pollUrl = `${window.location.origin}/polls/${poll.id as string}`;
    try {
      await navigator.clipboard.writeText(pollUrl);
      alert('Poll link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback: show the URL
      prompt('Copy this link to share your poll:', pollUrl);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg line-clamp-2">{poll.title as string}</CardTitle>
            {(poll.description as string) && (
              <CardDescription className="line-clamp-2">
                {poll.description as string}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/polls/${poll.id as string}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Poll
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/polls/${poll.id as string}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Poll
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Poll
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete Poll'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="font-medium">{poll.total_votes as number}</span> votes
              {timeLeft && (
                <>
                  <span>•</span>
                  <span>{timeLeft}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={poll.is_active && !isExpired ? 'default' : 'secondary'}>
                {isExpired ? 'Expired' : poll.is_active ? 'Active' : 'Inactive'}
              </Badge>
              {(poll.allow_multiple as boolean) && (
                <Badge variant="outline">Multiple</Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            {(poll.options as Array<Record<string, unknown>>)?.slice(0, 3).map((option) => (
              <div key={option.id as string} className="flex items-center justify-between text-sm">
                <span className="truncate">{option.text as string}</span>
                <span className="text-muted-foreground">{option.votes as number}</span>
              </div>
            ))}
            {(poll.options as Array<Record<string, unknown>>)?.length > 3 && (
              <div className="text-sm text-muted-foreground">
                +{(poll.options as Array<Record<string, unknown>>).length - 3} more options
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href={`/polls/${poll.id as string}`}>
                {isExpired ? 'View Results' : 'View Poll'}
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/polls/${poll.id as string}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
