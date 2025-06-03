"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, RotateCcw, Loader2 } from "lucide-react"

interface Question {
  id: number
  text: string
  answered: boolean
  answer?: string
  feedback?: string
}

export default function MockInterview() {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState("")
  const [role, setRole] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [interviewStarted, setInterviewStarted] = useState(false)

  const startInterview = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mock-interview",
          data: { role, jobDescription },
        }),
      })

      const result = await response.json()
      const questionTexts = result.questions.split("\n").filter((q: string) => q.trim())
      const formattedQuestions: Question[] = questionTexts.map((text: string, index: number) => ({
        id: index,
        text: text.replace(/^\d+\.\s*/, ""),
        answered: false,
      }))

      setQuestions(formattedQuestions)
      setInterviewStarted(true)
      setCurrentQuestion(0)
    } catch (error) {
      console.error("Error starting interview:", error)
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!answer.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mock-interview",
          data: {
            role,
            question: questions[currentQuestion].text,
            answer,
          },
        }),
      })

      const result = await response.json()

      const updatedQuestions = [...questions]
      updatedQuestions[currentQuestion] = {
        ...updatedQuestions[currentQuestion],
        answered: true,
        answer,
        feedback: result.feedback,
      }

      setQuestions(updatedQuestions)
      setAnswer("")
    } catch (error) {
      console.error("Error submitting answer:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const resetInterview = () => {
    setQuestions([])
    setCurrentQuestion(0)
    setAnswer("")
    setInterviewStarted(false)
  }

  if (!interviewStarted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Mock Interview
          </CardTitle>
          <CardDescription>Practice interviews with AI-powered questions and feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="role">Target Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frontend">Frontend Developer</SelectItem>
                <SelectItem value="backend">Backend Developer</SelectItem>
                <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                <SelectItem value="mobile">Mobile Developer</SelectItem>
                <SelectItem value="devops">DevOps Engineer</SelectItem>
                <SelectItem value="data">Data Scientist</SelectItem>
                <SelectItem value="qa">QA Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="jobDescription">Job Description (Optional)</Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description for more targeted questions..."
              className="h-32"
            />
          </div>

          <Button onClick={startInterview} disabled={loading || !role} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing Interview...
              </>
            ) : (
              "Start Mock Interview"
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Mock Interview - {role.charAt(0).toUpperCase() + role.slice(1)} Developer
            </CardTitle>
            <Button variant="outline" onClick={resetInterview}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          <CardDescription>
            Question {currentQuestion + 1} of {questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-1 mb-4">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded ${
                    index === currentQuestion
                      ? "bg-blue-500"
                      : questions[index].answered
                        ? "bg-green-500"
                        : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Question:</h3>
                <p className="text-gray-700">{currentQ.text}</p>
              </CardContent>
            </Card>

            {!currentQ.answered ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="answer">Your Answer</Label>
                  <Textarea
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="h-32"
                  />
                </div>
                <Button onClick={submitAnswer} disabled={loading || !answer.trim()} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Feedback...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Your Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{currentQ.answer}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-blue-600">AI Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{currentQ.feedback}</p>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                    className="flex-1"
                  >
                    Previous
                  </Button>
                  <Button onClick={nextQuestion} disabled={currentQuestion === questions.length - 1} className="flex-1">
                    Next Question
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {questions.every((q) => q.answered) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Interview Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Congratulations! You've completed the mock interview.</p>
            <div className="flex gap-2">
              <Badge variant="secondary">{questions.length} Questions Answered</Badge>
              <Badge variant="outline">Role: {role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
