"use client"

import { useState } from "react"
import { createPoll } from "@/lib/actions/polls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, X, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export function CreatePollForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState(["", ""]) // Start with 2 empty options
  const [isPublic, setIsPublic] = useState(true)
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false)
  const router = useRouter()

  const addOption = () => {
    if (options.length < 10) { // Limit to 10 options
      setOptions([...options, ""])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) { // Keep at least 2 options
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Add options to form data
      options.forEach((option, index) => {
        formData.append('options', option)
      })

      // Add switch values to form data
      formData.append('isPublic', isPublic.toString())
      formData.append('allowMultipleVotes', allowMultipleVotes.toString())

      const result = await createPoll(formData)
      
      if (result?.error) {
        setError(result.error)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create New Poll</CardTitle>
        <CardDescription className="text-center">
          Create an engaging poll for your community to vote on
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Poll Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="What would you like to ask?"
              required
              disabled={isLoading}
              className="text-lg"
            />
          </div>
          
          {/* Poll Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide more context about your poll..."
              disabled={isLoading}
              rows={3}
            />
          </div>
          
          {/* Poll Options */}
          <div className="space-y-3">
            <Label>Poll Options *</Label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    name="options"
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      disabled={isLoading}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {options.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                disabled={isLoading}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            )}
            
            <p className="text-sm text-muted-foreground">
              Minimum 2 options, maximum 10 options
            </p>
          </div>
          
          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date (Optional)</Label>
            <div className="relative">
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                disabled={isLoading}
                min={new Date().toISOString().slice(0, 16)}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <p className="text-sm text-muted-foreground">
              Leave empty for polls that never expire
            </p>
          </div>
          
          {/* Poll Settings */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Poll Settings</Label>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isPublic">Public Poll</Label>
                <p className="text-sm text-muted-foreground">
                  Anyone can view and vote on this poll
                </p>
              </div>
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowMultipleVotes">Allow Multiple Votes</Label>
                <p className="text-sm text-muted-foreground">
                  Users can vote for multiple options
                </p>
              </div>
              <Switch
                id="allowMultipleVotes"
                checked={allowMultipleVotes}
                onCheckedChange={setAllowMultipleVotes}
                disabled={isLoading}
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Poll...
              </>
            ) : (
              'Create Poll'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
