'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PollWithDetails } from '@/lib/types';
import { submitVote, removeVote, getUserVotes } from '@/lib/actions/votes';
import { useRouter } from 'next/navigation';

interface PollVotingFormProps {
  poll: PollWithDetails;
}

export function PollVotingForm({ poll }: PollVotingFormProps) {
  const [userVotes, setUserVotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserVotes = async () => {
      try {
        const votes = await getUserVotes(poll.id);
        setUserVotes(votes);
      } catch (err) {
        console.error('Failed to fetch user votes:', err);
      }
    };

    fetchUserVotes();
  }, [poll.id]);

  const handleVote = async (optionId: string) => {
    setIsLoading(true);
    setError('');

    try {
      if (userVotes.includes(optionId)) {
        // Remove vote
        await removeVote(poll.id, optionId);
        setUserVotes(prev => prev.filter(id => id !== optionId));
      } else {
        // Add vote
        await submitVote(poll.id, optionId);
        setUserVotes(prev => [...prev, optionId]);
      }
      
      // Refresh the page to show updated results
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
    } finally {
      setIsLoading(false);
    }
  };

  const canVote = (optionId: string) => {
    if (userVotes.includes(optionId)) {
      return true; // Can remove vote
    }
    
    if (!poll.allowMultiple && userVotes.length > 0) {
      return false; // Can't add vote if already voted and multiple not allowed
    }
    
    return true; // Can add vote
  };

  const getButtonText = (optionId: string) => {
    if (userVotes.includes(optionId)) {
      return 'Remove Vote';
    }
    return 'Vote for this option';
  };

  const getButtonVariant = (optionId: string) => {
    return userVotes.includes(optionId) ? 'default' : 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cast Your Vote</CardTitle>
        <CardDescription>
          {poll.allowMultiple 
            ? 'You can select multiple options' 
            : 'You can only select one option'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-md">
            {error}
          </div>
        )}
        
        {poll.options.map((option) => (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.text}</span>
              <span className="text-sm text-muted-foreground">
                {option.votes} votes
              </span>
            </div>
            
            <Button
              variant={getButtonVariant(option.id)}
              size="sm"
              onClick={() => handleVote(option.id)}
              disabled={isLoading || !canVote(option.id)}
              className="w-full"
            >
              {isLoading ? 'Processing...' : getButtonText(option.id)}
            </Button>
          </div>
        ))}
        
        {userVotes.length > 0 && (
          <div className="text-sm text-muted-foreground text-center pt-2 border-t">
            You have voted for {userVotes.length} option{userVotes.length > 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
