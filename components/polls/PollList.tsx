'use client';

import { useState, useEffect } from 'react';
import { PollCard } from './PollCard';
import { Poll } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface PollListProps {
  filters?: {
    search?: string;
    author?: string;
    isActive?: boolean;
  };
}

export function PollList({ filters }: PollListProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchPolls = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase.from('polls').select('id, title, description, options, author, isActive, allowMultiple, expiresAt, createdAt, updatedAt, totalVotes');

        if (filters?.search) {
          query = query.ilike('title', `%${filters.search}%`);
        }

        if (filters?.author) {
          query = query.eq('author', filters.author);
        }

        if (filters?.isActive !== undefined) {
          query = query.eq('isActive', filters.isActive);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setPolls(data as Poll[]);
      } catch (err) {
        console.dir(err);
        setError(err instanceof Error ? err.message : 'Error loading polls');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, [supabase, filters]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading polls: {error}</p>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No polls found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
