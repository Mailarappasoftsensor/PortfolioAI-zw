"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import EnvChecker from "@/components/env-checker"

export default function DebugPage() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_ENV: process.env.NODE_ENV,
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnvChecker />

          <Card>
            <CardHeader>
              <CardTitle>Environment Variables (Client-side)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <div className="font-mono text-sm font-medium">{key}</div>
                    <div className="text-xs text-gray-600 break-all">
                      {value ? (key.includes("KEY") ? "***" + value.slice(-4) : value) : "undefined"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Troubleshooting Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Make sure you have a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project
                  root
                </li>
                <li>Verify the environment variables are correctly formatted (no extra spaces)</li>
                <li>Restart your development server after adding environment variables</li>
                <li>
                  Check that the Supabase URL starts with <code className="bg-gray-100 px-1 rounded">https://</code>
                </li>
                <li>Ensure the anon key is a valid JWT token</li>
                <li>If deploying, make sure environment variables are set in your deployment platform</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
