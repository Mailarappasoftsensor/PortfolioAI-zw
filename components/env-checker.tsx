"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function EnvChecker() {
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean
    supabaseKey: boolean
    groqKey: boolean
  }>({
    supabaseUrl: false,
    supabaseKey: false,
    groqKey: false,
  })

  useEffect(() => {
    setEnvStatus({
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      groqKey: !!process.env.GROQ_API_KEY,
    })
  }, [])

  const getIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Environment Variables Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
          {getIcon(envStatus.supabaseUrl)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
          {getIcon(envStatus.supabaseKey)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">GROQ_API_KEY</span>
          {getIcon(envStatus.groqKey)}
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-600">
            If any variables show as missing, please restart your development server after adding them.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
