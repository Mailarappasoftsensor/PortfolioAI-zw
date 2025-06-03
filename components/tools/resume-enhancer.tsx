"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, Download, Copy, Loader2 } from "lucide-react"

export default function ResumeEnhancer() {
  const [loading, setLoading] = useState(false)
  const [enhancedResume, setEnhancedResume] = useState("")
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

  const enhanceResume = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enhance-resume",
          data: { resume: resumeText, jobDescription },
        }),
      })

      const result = await response.json()
      setEnhancedResume(result.enhancedResume)
    } catch (error) {
      console.error("Error enhancing resume:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(enhancedResume)
  }

  const downloadResume = () => {
    const blob = new Blob([enhancedResume], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "enhanced-resume.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Resume Enhancer
          </CardTitle>
          <CardDescription>
            Enhance your resume to better match job requirements and improve ATS compatibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="resume">Upload Resume (PDF/DOCX/TXT)</Label>
            <Input id="resume" type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="mt-1" />
          </div>

          {resumeText && (
            <div>
              <Label>Original Resume Preview</Label>
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

          <Button onClick={enhanceResume} disabled={loading || !resumeText || !jobDescription} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enhancing Resume...
              </>
            ) : (
              "Enhance Resume"
            )}
          </Button>
        </CardContent>
      </Card>

      {enhancedResume && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Enhanced Resume
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button onClick={downloadResume} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardTitle>
            <CardDescription>Your resume has been optimized for the target job description</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-auto">
              <pre className="text-sm whitespace-pre-wrap font-sans">{enhancedResume}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
