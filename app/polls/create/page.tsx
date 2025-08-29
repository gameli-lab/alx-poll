import { CreatePollForm } from "@/components/forms/create-poll-form"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function CreatePollPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Poll</h1>
          <p className="text-gray-600">
            Engage your community with an interactive poll
          </p>
        </div>
        
        <CreatePollForm />
      </div>
    </ProtectedRoute>
  )
}
