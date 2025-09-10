"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updatePoll } from "@/lib/actions/polls";
import { CreatePollForm as CreatePollFormType } from "@/lib/types";

interface EditPollFormProps {
  poll: Record<string, unknown>;
}

export function EditPollForm({ poll }: EditPollFormProps) {
  const [formData, setFormData] = useState<CreatePollFormType>({
    title: (poll.title as string) || "",
    description: (poll.description as string) || "",
    options: (poll.options as Array<Record<string, unknown>>)?.map(
      (option) => option.text as string,
    ) || ["", ""],
    allowMultiple: (poll.allow_multiple as boolean) || false,
    expiresAt: poll.expires_at
      ? new Date(poll.expires_at as string)
      : undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(2);

  const router = useRouter();

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => (i === index ? value : option)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);
    setCountdown(2);

    const validOptions = formData.options.filter(
      (option) => option.trim() !== "",
    );

    if (validOptions.length < 2) {
      setError("Please provide at least 2 options");
      setIsLoading(false);
      return;
    }

    try {
      await updatePoll(poll.id as string, {
        ...formData,
        options: validOptions,
      });

      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update poll");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    if (success && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      router.push("/my-polls");
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [success, countdown, router]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Poll</CardTitle>
        <CardDescription>Update your poll details and options</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              placeholder="What is your poll about?"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              disabled={success}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide more context about your poll..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              disabled={success}
            />
          </div>

          <div className="space-y-4">
            <Label>Poll Options *</Label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  required
                  disabled={success}
                />
                {formData.options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                    disabled={success}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              className="w-full"
              disabled={success}
            >
              Add Option
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={
                formData.expiresAt
                  ? new Date(formData.expiresAt).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  expiresAt: e.target.value
                    ? new Date(e.target.value)
                    : undefined,
                }))
              }
              disabled={success}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.allowMultiple}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    allowMultiple: e.target.checked,
                  }))
                }
                className="rounded"
                disabled={success}
              />
              <span>Allow multiple selections</span>
            </Label>
          </div>

          {success && (
            <div className="text-sm text-green-600 text-center bg-green-50 p-4 rounded-md border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="font-medium">Poll updated successfully!</span>
              </div>
              <p className="text-green-700">
                Redirecting to my polls in {countdown} second
                {countdown !== 1 ? "s" : ""}...
              </p>
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive text-center">{error}</div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || success}
              className="flex-1"
            >
              {isLoading
                ? "Updating Poll..."
                : success
                  ? "Poll Updated!"
                  : "Update Poll"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
