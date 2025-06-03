"use client"

import { useState } from "react"
import type { User, SupabaseClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Mail, Search, Zap, Briefcase, MessageSquare, LogOut, ArrowLeft } from "lucide-react"
import PortfolioGenerator from "./tools/portfolio-generator"
import CoverLetterGenerator from "./tools/cover-letter-generator"
import ResumeAnalyzer from "./tools/resume-analyzer"
import ResumeEnhancer from "./tools/resume-enhancer"
import JobSearch from "./tools/job-search"
import MockInterview from "./tools/mock-interview"
import Footer from "./footer"

interface ToolSuiteProps {
  user: User
  supabase: SupabaseClient
}

type Tool =
  | "portfolio"
  | "cover-letter"
  | "resume-analyzer"
  | "resume-enhancer"
  | "job-search"
  | "mock-interview"
  | null

const tools = [
  {
    id: "portfolio" as Tool,
    title: "Portfolio Generator",
    description: "Generate a professional portfolio website from your resume",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    id: "cover-letter" as Tool,
    title: "Cover Letter Generator",
    description: "Create tailored cover letters for specific job applications",
    icon: Mail,
    color: "bg-green-500",
  },
  {
    id: "resume-analyzer" as Tool,
    title: "Resume Analyzer",
    description: "Analyze your resume against job descriptions for ATS compatibility",
    icon: Search,
    color: "bg-purple-500",
  },
  {
    id: "resume-enhancer" as Tool,
    title: "Resume Enhancer",
    description: "Enhance your resume to better match job requirements",
    icon: Zap,
    color: "bg-orange-500",
  },
  {
    id: "job-search" as Tool,
    title: "Job Search",
    description: "Search for relevant job opportunities",
    icon: Briefcase,
    color: "bg-indigo-500",
  },
  {
    id: "mock-interview" as Tool,
    title: "Mock Interview",
    description: "Practice interviews with AI-powered feedback",
    icon: MessageSquare,
    color: "bg-red-500",
  },
]

export default function ToolSuite({ user, supabase }: ToolSuiteProps) {
  const [activeTool, setActiveTool] = useState<Tool>(null)

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const renderTool = () => {
    switch (activeTool) {
      case "portfolio":
        return <PortfolioGenerator />
      case "cover-letter":
        return <CoverLetterGenerator />
      case "resume-analyzer":
        return <ResumeAnalyzer />
      case "resume-enhancer":
        return <ResumeEnhancer />
      case "job-search":
        return <JobSearch />
      case "mock-interview":
        return <MockInterview />
      default:
        return null
    }
  }

  if (activeTool) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => setActiveTool(null)} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
          {renderTool()}
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">PortfolioAI</h1>
            <p className="text-gray-600">Welcome back, {user.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Card
                key={tool.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveTool(tool.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tool.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            All tools operate statelessly - your data is processed in real-time and not stored.
          </p>
        </div>
        <Footer />
      </div>
    </div>
  )
}
