import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Tables } from "@/types/supabase";

interface PollResultsProps {
  pollId: string;
}

/**
 * A Server Component that fetches and displays the results of a specific poll.
 * It retrieves poll details, options, and vote counts directly from Supabase.
 *
 * @param {Object} props - The properties for the PollResults component.
 * @param {string} props.pollId - The ID of the poll to fetch and display results for.
 */
export default async function PollResults({ pollId }: PollResultsProps) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("*, poll_options(*)") // Select poll and its options
    .eq("id", pollId)
    .single();

  if (pollError) {
    console.error("Error fetching poll:", pollError.message);
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load poll results: {pollError.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!poll) {
    return (
      <Alert>
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>Poll not found.</AlertDescription>
      </Alert>
    );
  }

  const totalVotes = poll.poll_options.reduce(
    (sum: number, option: Tables<"poll_options">["Row"]) => sum + option.votes,
    0,
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        <CardDescription>{poll.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {poll.poll_options.length === 0 ? (
          <p className="text-muted-foreground">
            No options available for this poll.
          </p>
        ) : (
          <div className="space-y-4">
            {poll.poll_options.map((option) => (
              <div key={option.id} className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{option.text}</span>
                  <span className="text-sm font-bold">
                    {option.votes} votes
                  </span>
                </div>
                <Progress
                  value={totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="pt-4 text-sm text-muted-foreground flex justify-between">
        <span>Total Votes: {totalVotes}</span>
        <span>{poll.is_active ? "Active" : "Inactive"}</span>
      </CardFooter>
    </Card>
  );
}
