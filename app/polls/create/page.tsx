import { CreatePollForm } from "@/components/polls/create-poll-form"

export default function CreatePollPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Poll</h1>
        <p className="text-gray-600">Share your question with the community and gather opinions</p>
      </div>
      
      <div className="flex justify-center">
        <CreatePollForm />
      </div>
    </div>
  )
}
