import { PollList } from '@/components/polls/PollList';
import { Layout } from '@/components/layout/Layout';

export default function PollsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Browse Polls</h1>
            <p className="text-muted-foreground mt-2">
              Discover and participate in polls from the community
            </p>
          </div>
          
          <PollList />
        </div>
      </div>
    </Layout>
  );
}
