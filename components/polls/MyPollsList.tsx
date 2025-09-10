import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MyPollCard } from './MyPollCard';

interface MyPollsListProps {
  initialPolls: unknown[];
}

export function MyPollsList({ initialPolls }: MyPollsListProps) {
  if (initialPolls.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <h2 className="text-xl font-semibold">No polls created yet</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          Get started by creating your first poll.
        </p>
        <Button asChild>
          <Link href="/polls/create">Create a Poll</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialPolls.map((poll) => (
        <MyPollCard key={(poll as Record<string, unknown>).id as string} poll={poll as Record<string, unknown>} />
      ))}
    </div>
  );
}
