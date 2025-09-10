import { PollCard } from './PollCard';
import { getPolls } from '@/lib/actions/polls';
import { transformPoll } from '@/lib/utils/transformers';

interface PollListProps {
  filters?: {
    search?: string;
    author?: string;
    isActive?: boolean;
    sortBy?: 'created_at' | 'total_votes' | 'title';
    sortOrder?: 'asc' | 'desc';
  };
}

export async function PollList({ filters }: PollListProps) {
  try {
    const polls = await getPolls(filters);

    if (polls.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No polls found.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => {
          // Transform the database poll to application format
          const transformedPoll = transformPoll(
            poll,
            poll.options || [],
            {
              id: poll.author_id,
              email: poll.author_email || '',
              name: poll.author_name || 'Unknown',
              avatar: poll.author_avatar || undefined,
              createdAt: new Date(poll.created_at),
              updatedAt: new Date(poll.updated_at),
            }
          );

          return <PollCard key={poll.id} poll={transformedPoll} />;
        })}
      </div>
    );
  } catch (error) {
    console.error('Error loading polls:', error);
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Error loading polls: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }
}
