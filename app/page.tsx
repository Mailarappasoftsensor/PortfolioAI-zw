"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import type { User } from "@supabase/supabase-js"
import ToolSuite from "@/components/tool-suite"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    // Get environment variables on the client side
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Check if we have the required environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      setAuthError("Supabase configuration is missing. Please check your environment variables.")
      setLoading(false)
      return
    }

    try {
      // Create Supabase client
      const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
      setSupabase(supabaseClient)

      // Get initial session
      supabaseClient.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          setAuthError(error.message)
        }
        setUser(session?.user ?? null)
        setLoading(false)
      })

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN") {
          setAuthError(null)
        }
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error("Supabase initialization error:", error)
      setAuthError("Failed to initialize Supabase client")
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show configuration error if Supabase client isn't initialized
  if (!supabase || authError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">PortfolioAI</h1>
              <p className="text-gray-600">Configuration Error</p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                {authError || "Supabase configuration is missing. Please check your environment variables."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">PortfolioAI</h1>
              <p className="text-gray-600 mb-4">AI-Powered Job Application Tools</p>
              <p className="text-sm text-gray-500">
                Sign in to access your personalized suite of AI-powered career tools
              </p>
            </div>
            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#3b82f6",
                      brandAccent: "#2563eb",
                    },
                  },
                },
              }}
              providers={["google", "github"]}
              redirectTo={typeof window !== "undefined" ? window.location.origin : ""}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return <ToolSuite user={user} supabase={supabase} />
}
