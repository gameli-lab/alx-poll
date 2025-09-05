'use client';

import { useState, useEffect } from 'react';
import { Poll, CreatePollForm, PollFilters } from '@/lib/types';

export function usePolls(filters?: PollFilters) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPolls();
  }, [filters]);

  const fetchPolls = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual API call
      // Mock data for now
      const mockPolls: Poll[] = [
        {
          id: '1',
          title: 'What is your favorite programming language?',
          description: 'Help us understand the community preferences',
          options: [
            { id: '1', text: 'JavaScript', votes: 45, pollId: '1' },
            { id: '2', text: 'Python', votes: 38, pollId: '1' },
            { id: '3', text: 'TypeScript', votes: 32, pollId: '1' },
            { id: '4', text: 'Rust', votes: 15, pollId: '1' },
          ],
          author: {
            id: '1',
            email: 'john@example.com',
            name: 'John Doe',
            avatar: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          isActive: true,
          allowMultiple: false,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          createdAt: new Date(),
          updatedAt: new Date(),
          totalVotes: 130,
        },
      ];
      setPolls(mockPolls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch polls');
    } finally {
      setIsLoading(false);
    }
  };

  const createPoll = async (pollData: CreatePollForm) => {
    try {
      // TODO: Implement actual API call
      console.log('Creating poll:', pollData);
      // Mock creation
      const newPoll: Poll = {
        id: Date.now().toString(),
        title: pollData.title,
        description: pollData.description,
        options: pollData.options.map((text, index) => ({
          id: index.toString(),
          text,
          votes: 0,
          pollId: Date.now().toString(),
        })),
        author: {
          id: '1',
          email: 'current@user.com',
          name: 'Current User',
          avatar: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        isActive: true,
        allowMultiple: pollData.allowMultiple,
        expiresAt: pollData.expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
        totalVotes: 0,
      };
      setPolls(prev => [newPoll, ...prev]);
      return newPoll;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll');
      throw err;
    }
  };

  const voteOnPoll = async (pollId: string, optionId: string) => {
    try {
      // TODO: Implement actual API call
      console.log('Voting on poll:', pollId, optionId);
      // Mock vote
      setPolls(prev => prev.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map(option => 
              option.id === optionId 
                ? { ...option, votes: option.votes + 1 }
                : option
            ),
            totalVotes: poll.totalVotes + 1,
          };
        }
        return poll;
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
      throw err;
    }
  };

  return {
    polls,
    isLoading,
    error,
    createPoll,
    voteOnPoll,
    refetch: fetchPolls,
  };
}
