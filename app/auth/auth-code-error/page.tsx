import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Authentication Error</h1>
        <p className="mt-2 text-sm text-gray-600">
          There was an error during the authentication process. Please try again.
        </p>
        <Link href="/auth/login">
          <span className="inline-block bg-primary text-white px-4 py-2 rounded-md mt-4">Go to Login</span>
        </Link>
      </div>
    </div>
  )
}
