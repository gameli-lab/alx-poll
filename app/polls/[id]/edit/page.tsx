import { notFound, redirect } from 'next/navigation';
import { getPollById } from '@/lib/actions/polls';
import { Layout } from '@/components/layout/Layout';
import { EditPollForm } from '@/components/polls/EditPollForm';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

interface EditPollPageProps {
  params: {
    id: string;
  };
}

export default async function EditPollPage({ params }: EditPollPageProps) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      redirect('/auth/login');
    }

    const poll = await getPollById(params.id);

    if (!poll) {
      notFound();
    }

    // Check if the user owns this poll
    if (poll.author_id !== user.id) {
      redirect('/my-polls');
    }

    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold">Edit Poll</h1>
              <p className="text-muted-foreground mt-2">
                Update your poll details and options
              </p>
            </div>
            
            <EditPollForm poll={poll} />
          </div>
        </div>
      </Layout>
    );
  } catch (error) {
    console.error('Error loading poll for edit:', error);
    notFound();
  }
}
