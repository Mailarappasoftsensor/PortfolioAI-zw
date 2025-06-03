"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface Analysis {
  atsScore: number
  strengths: string[]
  improvements: string[]
  missingKeywords: string[]
  recommendations: string[]
}

export default function ResumeAnalyzer() {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setResumeText(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const analyzeResume = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze-resume",
          data: { resume: resumeText, jobDescription },
        }),
      })

      const result = await response.json()
      setAnalysis(result.analysis)
    } catch (error) {
      console.error("Error analyzing resume:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Resume Analyzer
          </CardTitle>
          <CardDescription>
            Analyze your resume against a job description for ATS compatibility and optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="resume">Upload Resume (PDF/DOCX/TXT)</Label>
            <Input id="resume" type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="mt-1" />
          </div>

          {resumeText && (
            <div>
              <Label>Resume Content Preview</Label>
              <Textarea value={resumeText.substring(0, 300) + "..."} readOnly className="mt-1 h-24" />
            </div>
          )}

          <div>
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here..."
              className="mt-1 h-48"
            />
          </div>

          <Button onClick={analyzeResume} disabled={loading || !resumeText || !jobDescription} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              "Analyze Resume"
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getScoreIcon(analysis.atsScore)}
                ATS Compatibility Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                    {analysis.atsScore}/100
                  </span>
                </div>
                <Progress value={analysis.atsScore} className="w-full" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Areas for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Missing Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-orange-600 border-orange-600">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
