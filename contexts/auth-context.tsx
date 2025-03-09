"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User } from "@/types/database.types"
import { getUser } from "@/lib/auth"
import { signOutAction } from "@/actions/users"

type AuthContextType = {
  user: User | null
  isLoading: boolean
  error: string | null
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshUser = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await getUser()
      setUser(userData)
    } catch (err) {
      console.error("Failed to fetch user:", err)
      setError("Failed to fetch user data")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      const { errorMessage } = await signOutAction()
      if (errorMessage) {
        throw new Error(errorMessage)
      }
      setUser(null)
    } catch (err) {
      console.error("Failed to sign out:", err)
      setError("Failed to sign out")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, error, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}