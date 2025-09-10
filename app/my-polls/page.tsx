import { getPolls } from '@/lib/actions/polls';
import { Layout } from '@/components/layout/Layout';
import { MyPollsList } from '@/components/polls/MyPollsList';

export const metadata = {
  title: 'My Polls',
};

export default async function MyPollsPage() {
  try {
    const polls = await getPolls({ currentUserOnly: true });

    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  My Polls
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage and view your created polls
                </p>
              </div>
            </div>
            
            <MyPollsList initialPolls={polls} />
          </div>
        </div>
      </Layout>
    );
  } catch (error) {
    console.error('Error loading my polls:', error);
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold">My Polls</h1>
            <p className="text-destructive mt-2">
              Error loading polls: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }
}
