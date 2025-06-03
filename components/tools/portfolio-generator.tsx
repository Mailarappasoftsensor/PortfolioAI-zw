"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  Download,
  Loader2,
  AlertTriangle,
  Eye,
  Code,
  Info,
  FileText,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react"
import { readFileAsText, downloadFile, validateFileType, validateFileSize, estimateTokens } from "@/lib/file-utils"

export default function PortfolioGenerator() {
  const [loading, setLoading] = useState(false)
  const [portfolio, setPortfolio] = useState("")
  const [warning, setWarning] = useState("")
  const [inputMethod, setInputMethod] = useState<"upload" | "form">("upload")
  const [resumeText, setResumeText] = useState("")
  const [previewMode, setPreviewMode] = useState<"code" | "preview">("preview")
  const [fileName, setFileName] = useState<string>("")
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStep, setGenerationStep] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    experience: "",
    projects: "",
    education: "",
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    // Validate file type
    if (!validateFileType(file)) {
      alert("Please upload a valid file type (PDF, DOCX, or TXT)")
      return
    }

    // Validate file size
    const sizeValidation = validateFileSize(file)
    if (!sizeValidation.isValid) {
      alert(sizeValidation.message)
      return
    }

    try {
      const text = await readFileAsText(file)

      // Check token count and warn user
      const tokens = estimateTokens(text)
      if (tokens > 1500) {
        setWarning(
          `Large file detected (${tokens} tokens). Content will be truncated to fit within free tier limits (1,500 tokens max).`,
        )
      } else {
        setWarning("")
      }

      setResumeText(text)
    } catch (error) {
      console.error("Error reading file:", error)
      alert("Error reading file. Please try again.")
    }
  }

  const generatePortfolio = async () => {
    setLoading(true)
    setWarning("")
    setGenerationProgress(0)
    setGenerationStep("Analyzing resume content...")

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }

          // Update generation step based on progress
          if (prev === 0) setGenerationStep("Analyzing resume content...")
          else if (prev === 20) setGenerationStep("Extracting professional information...")
          else if (prev === 40) setGenerationStep("Designing portfolio structure...")
          else if (prev === 60) setGenerationStep("Creating responsive layout...")
          else if (prev === 80) setGenerationStep("Finalizing portfolio design...")

          return prev + 10
        })
      }, 600)

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-portfolio",
          data: inputMethod === "upload" ? { resume: resumeText } : { answers: formData },
        }),
      })

      clearInterval(progressInterval)
      setGenerationProgress(100)
      setGenerationStep("Portfolio generated successfully!")

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate portfolio")
      }

      setPortfolio(result.portfolio)

      if (result.warning) {
        setWarning(result.warning)
      }
    } catch (error) {
      console.error("Error generating portfolio:", error)
      alert(error instanceof Error ? error.message : "Error generating portfolio. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const downloadPortfolio = () => {
    const name = formData.name || "portfolio"
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "-")
    downloadFile(portfolio, `${cleanName}-portfolio.html`, "text/html")
  }

  const openPreview = () => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(portfolio)
      newWindow.document.close()
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-gradient overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl text-blue-900">Portfolio Generator</CardTitle>
              <CardDescription className="text-blue-700">
                Create a stunning professional portfolio website in seconds
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 mt-0.5">
                <Info className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Portfolio Generator</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Upload your resume or fill out the form below to generate a professional portfolio website that
                  showcases your skills and experience.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Real data extraction
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Responsive design
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Modern layout
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Instant preview
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {warning && (
            <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
              <div className="bg-amber-100 rounded-full p-2 mt-0.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Content Notice</h4>
                <p className="text-sm text-amber-700">{warning}</p>
              </div>
            </div>
          )}

          <Tabs
            value={inputMethod}
            onValueChange={(value) => setInputMethod(value as "upload" | "form")}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="upload" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Upload Resume
              </TabsTrigger>
              <TabsTrigger value="form" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Fill Form
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 border-none p-0 pt-4">
              <div
                className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={triggerFileInput}
              >
                <input
                  ref={fileInputRef}
                  id="resume"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Upload className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-blue-800 font-medium mb-1">Upload Your Resume</h3>
                <p className="text-sm text-blue-600 mb-3">
                  Drag and drop your file here or click to browse (PDF, DOCX, or TXT, max 1MB)
                </p>
                {fileName ? (
                  <div className="flex items-center justify-center gap-2 text-blue-700 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {fileName}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Select File
                  </Button>
                )}
              </div>

              {resumeText && (
                <div className="bg-white p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-blue-800">Resume Content Preview</Label>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600">
                      {estimateTokens(resumeText)} tokens
                    </Badge>
                  </div>
                  <Textarea
                    value={resumeText.substring(0, 500) + (resumeText.length > 500 ? "..." : "")}
                    readOnly
                    className="mt-1 h-32 bg-gray-50 text-gray-600 text-sm"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="form" className="border-none p-0 pt-4">
              <div className="bg-white p-6 rounded-xl border border-blue-100">
                <h3 className="text-blue-800 font-medium mb-4">Enter Your Professional Information</h3>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-blue-700">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="mt-1 border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-blue-700">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="mt-1 border-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-blue-700">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="mt-1 border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="summary" className="text-blue-700">
                      Professional Summary *
                    </Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Brief professional summary highlighting your key strengths and career objectives..."
                      className="mt-1 h-24 border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills" className="text-blue-700">
                      Skills *
                    </Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="JavaScript, React, Node.js, Python, AWS, Docker, etc."
                      className="mt-1 h-20 border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience" className="text-blue-700">
                      Work Experience *
                    </Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="Software Engineer at Tech Corp (2022-Present)
- Developed and maintained web applications using React and Node.js
- Collaborated with cross-functional teams to deliver high-quality software
- Improved application performance by 30% through optimization techniques"
                      className="mt-1 h-40 border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="projects" className="text-blue-700">
                      Projects
                    </Label>
                    <Textarea
                      id="projects"
                      value={formData.projects}
                      onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                      placeholder="E-commerce Platform - Built a full-stack e-commerce application with React, Node.js, and MongoDB
Task Management App - Created a collaborative task management tool with real-time updates"
                      className="mt-1 h-32 border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="education" className="text-blue-700">
                      Education
                    </Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="Bachelor of Science in Computer Science
University Name (2018-2022)"
                      className="mt-1 h-20 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {loading && (
            <div className="mb-6 p-4 bg-white rounded-xl border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Generating Your Portfolio</h4>
              <Progress value={generationProgress} className="h-2 mb-2" />
              <p className="text-sm text-blue-600">{generationStep}</p>
            </div>
          )}

          <Button
            onClick={generatePortfolio}
            disabled={
              loading ||
              (inputMethod === "upload" && !resumeText) ||
              (inputMethod === "form" && (!formData.name || !formData.email || !formData.summary || !formData.skills))
            }
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Your Portfolio...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Professional Portfolio
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {portfolio && (
        <Card className="border-gradient overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl text-green-900">Your Portfolio is Ready!</CardTitle>
                  <CardDescription className="text-green-700">
                    Preview your professional portfolio website and download the HTML file
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={openPreview}
                  variant="outline"
                  size="sm"
                  className="bg-white border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Full Preview
                </Button>
                <Button
                  onClick={downloadPortfolio}
                  variant="outline"
                  size="sm"
                  className="bg-white border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download HTML
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6">
              <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as "code" | "preview")}>
                <TabsList className="mb-2">
                  <TabsTrigger
                    value="preview"
                    className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    HTML Code
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="mt-4 border-none p-0">
                  <div className="border rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-100 border-b p-2 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="text-xs text-gray-500 flex-1 text-center">Portfolio Preview</div>
                    </div>
                    <iframe
                      srcDoc={portfolio}
                      className="w-full h-[500px] border-0"
                      title="Portfolio Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" />
                    This is a preview of your portfolio. Click "Full Preview" button above to open in a new window.
                  </p>
                </TabsContent>

                <TabsContent value="code" className="mt-4 border-none p-0">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-[500px] overflow-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800">{portfolio}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
              <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Next Steps
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full p-1 mt-0.5">
                    <Download className="h-3.5 w-3.5 text-green-700" />
                  </div>
                  <span className="text-sm text-green-800">Download the HTML file and save it as "index.html"</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full p-1 mt-0.5">
                    <ExternalLink className="h-3.5 w-3.5 text-green-700" />
                  </div>
                  <span className="text-sm text-green-800">
                    Host it on GitHub Pages, Netlify, Vercel, or any web hosting service
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full p-1 mt-0.5">
                    <Code className="h-3.5 w-3.5 text-green-700" />
                  </div>
                  <span className="text-sm text-green-800">
                    Customize the colors, fonts, or layout if needed by editing the HTML file
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full p-1 mt-0.5">
                    <ExternalLink className="h-3.5 w-3.5 text-green-700" />
                  </div>
                  <span className="text-sm text-green-800">Share your portfolio URL with potential employers</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-green-200 text-green-700 hover:bg-green-50"
              onClick={() => setPortfolio("")}
            >
              Create Another Portfolio
            </Button>
            <Button
              onClick={downloadPortfolio}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Portfolio
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
