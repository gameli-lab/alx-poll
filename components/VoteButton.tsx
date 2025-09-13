"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitVote } from "@/lib/actions/votes";

interface VoteButtonProps {
  pollId: string;
  optionId: string;
  onVoteSuccess?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * A client-side button component for casting a vote on a poll option.
 * It handles loading states, calls the server action, and shows toast notifications.
 *
 * @param {Object} props - The properties for the VoteButton component.
 * @param {string} props.pollId - The ID of the poll the option belongs to.
 * @param {string} props.optionId - The ID of the option to vote for.
 * @param {() => void} [props.onVoteSuccess] - Optional callback function to be called on successful vote submission.
 * @param {React.ReactNode} props.children - The content to be rendered inside the button.
 * @param {boolean} [props.disabled] - Whether the button should be disabled.
 */
export function VoteButton({
  pollId,
  optionId,
  onVoteSuccess,
  children,
  disabled,
}: VoteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async () => {
    setIsLoading(true);
    try {
      await submitVote(pollId, optionId);
      toast.success("Vote cast successfully!");
      if (onVoteSuccess) {
        onVoteSuccess();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast.error("Failed to cast vote", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleVote} disabled={isLoading || disabled}>
      {isLoading ? "Voting..." : children}
    </Button>
  );
}
