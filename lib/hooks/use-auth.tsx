"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { User, AuthState, LoginCredentials, RegisterCredentials } from "@/lib/types/auth"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem("auth_token")
    const user = localStorage.getItem("auth_user")
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user)
        setAuthState({
          user: parsedUser,
          token,
          isAuthenticated: true,
          isLoading: false
        })
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      // TODO: Replace with actual API call
      const response = await mockLoginAPI(credentials)
      
      const { user, token } = response
      
      // Store in localStorage
      localStorage.setItem("auth_token", token)
      localStorage.setItem("auth_user", JSON.stringify(user))
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      // TODO: Replace with actual API call
      const response = await mockRegisterAPI(credentials)
      
      const { user, token } = response
      
      // Store in localStorage
      localStorage.setItem("auth_token", token)
      localStorage.setItem("auth_user", JSON.stringify(user))
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    })
  }

  const updateUser = (user: User) => {
    setAuthState(prev => ({ ...prev, user }))
    localStorage.setItem("auth_user", JSON.stringify(user))
  }

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateUser
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

// Mock API functions - replace with actual API calls
async function mockLoginAPI(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simulate validation
  if (credentials.email === "demo@example.com" && credentials.password === "password") {
    return {
      user: {
        id: "1",
        name: "Demo User",
        email: credentials.email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      token: "mock_jwt_token_" + Date.now()
    }
  }
  
  throw new Error("Invalid credentials")
}

async function mockRegisterAPI(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simulate validation
  if (credentials.password !== credentials.confirmPassword) {
    throw new Error("Passwords do not match")
  }
  
  return {
    user: {
      id: Date.now().toString(),
      name: credentials.name,
      email: credentials.email,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    },
    token: "mock_jwt_token_" + Date.now()
  }
}
