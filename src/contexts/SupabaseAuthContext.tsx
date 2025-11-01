import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  currentUser: User | null
  session: Session | null
  loading: boolean
  isNewUser: boolean
  hasUnauthorizedDomainError: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const [hasUnauthorizedDomainError, setHasUnauthorizedDomainError] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setCurrentUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user ? 'User logged in' : 'No user')
      setSession(session)
      setCurrentUser(session?.user ?? null)
      
      if (session?.user) {
        // Check if this user has a profile
        try {
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (error && error.code === 'PGRST116') {
            // Table doesn't exist yet, mark as new user
            setIsNewUser(true)
          } else if (!profile) {
            // User has no profile, mark as new user
            setIsNewUser(true)
          } else {
            setIsNewUser(false)
          }
        } catch (error) {
          console.error("Error checking user profile:", error)
          setIsNewUser(true)
        }
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting to sign up:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      })

      if (error) throw error

      if (data.user) {
        setIsNewUser(true)
        
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: name,
              created_at: new Date().toISOString(),
              is_onboarding_complete: false,
            }
          ])
        
        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }
        
        console.log('User signed up successfully')
        
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        })
      }
    } catch (error: any) {
      console.error("Sign up error:", error)
      let errorMessage = "Sign up failed"
      
      if (error.message?.includes('already registered')) {
        errorMessage = "An account with this email already exists"
      } else if (error.message?.includes('invalid email')) {
        errorMessage = "Please enter a valid email address"
      } else if (error.message?.includes('password')) {
        errorMessage = "Password should be at least 6 characters"
      } else {
        errorMessage = error.message || "Sign up failed"
      }
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      console.log('User signed in successfully')
    } catch (error: any) {
      console.error("Sign in error:", error)
      let errorMessage = "Sign in failed"
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password"
      } else if (error.message?.includes('invalid email')) {
        errorMessage = "Please enter a valid email address"
      } else {
        errorMessage = error.message || "Sign in failed"
      }
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign in')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
      
      console.log('Google sign in initiated')
    } catch (error: any) {
      console.error("Google sign in error:", error)
      let errorMessage = "Google sign in failed"
      
      if (error.message?.includes('OAuth')) {
        errorMessage = "Google authentication is not properly configured"
      } else {
        errorMessage = error.message || "Google sign in failed"
      }
      
      toast({
        title: "Google sign in failed",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    }
  }

  const logOut = async () => {
    try {
      console.log('Attempting to sign out')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      console.log('User signed out successfully')
    } catch (error: any) {
      console.error("Sign out error:", error)
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const value = {
    currentUser,
    session,
    loading,
    isNewUser,
    hasUnauthorizedDomainError,
    signUp,
    signIn,
    signInWithGoogle,
    logOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}