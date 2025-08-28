"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(session?.user ?? null)
      }
      if (event === "SIGNED_OUT") {
        setUser(null)
      }
      setIsLoading(false)
    })

    async function getUser() {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    getUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabaseBrowser.auth.signOut()
    router.push("/login")
  }

  const value: AuthContextType = {
    user,
    isLoading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
