"use client"

import { useEffect } from "react"

interface AnalyticsProps {
  event: string
  data?: Record<string, any>
}

export function trackEvent(event: string, data?: Record<string, any>) {
  // In a production app, you would send this to your analytics service
  console.log("Analytics Event:", event, data)

  // Example: Send to your analytics service
  // analytics.track(event, data)
}

export default function Analytics({ event, data }: AnalyticsProps) {
  useEffect(() => {
    trackEvent(event, data)
  }, [event, data])

  return null
}
