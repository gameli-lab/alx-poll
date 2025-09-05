import { CreatePollForm } from '@/components/polls/CreatePollForm';
import { Layout } from '@/components/layout/Layout';

export default function CreatePollPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Create a Poll</h1>
            <p className="text-muted-foreground mt-2">
              Share your question with the community
            </p>
          </div>
          
          <CreatePollForm />
        </div>
      </div>
    </Layout>
  );
}
