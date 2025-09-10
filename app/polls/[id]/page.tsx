import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { getPollById } from '@/lib/actions/polls';
import { transformPoll } from '@/lib/utils/transformers';
import { formatDistanceToNow } from 'date-fns';
import { PollVotingForm } from '@/components/polls/PollVotingForm';

interface PollDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PollDetailPage({ params }: PollDetailPageProps) {
  try {
    const poll = await getPollById(params.id);

    if (!poll) {
      notFound();
    }

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

    const isExpired = transformedPoll.expiresAt && new Date() > transformedPoll.expiresAt;
    const timeLeft = transformedPoll.expiresAt 
      ? formatDistanceToNow(transformedPoll.expiresAt, { addSuffix: true })
      : null;

    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">{transformedPoll.title}</h1>
              {transformedPoll.description && (
                <p className="text-lg text-muted-foreground">{transformedPoll.description}</p>
              )}
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>By {transformedPoll.author.name}</span>
                <span>•</span>
                <span>{transformedPoll.totalVotes} votes</span>
                {timeLeft && (
                  <>
                    <span>•</span>
                    <span>{timeLeft}</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Badge variant={transformedPoll.isActive && !isExpired ? 'default' : 'secondary'}>
                  {isExpired ? 'Expired' : transformedPoll.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {transformedPoll.allowMultiple && (
                  <Badge variant="outline">Multiple choice</Badge>
                )}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Poll Options</CardTitle>
                <CardDescription>
                  {isExpired ? 'Final results' : 'Cast your vote'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {transformedPoll.options.map((option) => {
                  const percentage = transformedPoll.totalVotes > 0 
                    ? Math.round((option.votes / transformedPoll.totalVotes) * 100)
                    : 0;

                  return (
                    <div key={option.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.text}</span>
                        <span className="text-sm text-muted-foreground">
                          {option.votes} votes ({percentage}%)
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {!isExpired && transformedPoll.isActive && (
              <PollVotingForm poll={transformedPoll} />
            )}
          </div>
        </div>
      </Layout>
    );
  } catch (error) {
    console.error('Error loading poll:', error);
    notFound();
  }
}
