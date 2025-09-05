'use client';

import { PollCard } from './PollCard';
import { Poll } from '@/lib/types';
import { usePolls } from '@/lib/hooks/usePolls';

interface PollListProps {
  filters?: {
    search?: string;
    author?: string;
    isActive?: boolean;
  };
}

export function PollList({ filters }: PollListProps) {
  const { polls, isLoading, error } = usePolls(filters);

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
