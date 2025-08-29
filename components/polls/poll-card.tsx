"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, BarChart3 } from "lucide-react"
import { Poll } from "@/lib/types/poll"

interface PollCardProps extends Poll {
  onVote?: (optionId: string) => void
  onView?: () => void
}

export function PollCard({
  id,
  title,
  description,
  options,
  total_votes,
  end_date,
  status,
  onVote,
  onView
}: PollCardProps) {
  const isActive = status === 'active'
  const isClosed = status === 'closed'

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="line-clamp-2">{description}</CardDescription>
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : isClosed ? "Closed" : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {end_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {isActive ? "Ends: " : "Ended: "}
              {new Date(end_date).toLocaleDateString()}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{total_votes} votes</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          <span>{options.length} options</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={onView} className="flex-1">
          View Details
        </Button>
        {isActive && onVote && (
          <Button onClick={() => onVote(id)} className="flex-1">
            Vote Now
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
