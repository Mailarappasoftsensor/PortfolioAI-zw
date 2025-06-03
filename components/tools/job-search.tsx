"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, Clock, ExternalLink, Search, Loader2 } from "lucide-react"

interface Job {
  title: string
  company: string
  location: string
  description: string
  postedDate: string
  url: string
  salary?: string
}

export default function JobSearch() {
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchParams, setSearchParams] = useState({
    keywords: "",
    location: "",
    experience: "",
  })

  const searchJobs = async () => {
    setLoading(true)
    try {
      // Note: This is a mock implementation since LinkedIn API requires special access
      // In a real implementation, you would integrate with job search APIs
      const mockJobs: Job[] = [
        {
          title: "Frontend Developer",
          company: "Tech Corp",
          location: "San Francisco, CA",
          description: "We are looking for a skilled Frontend Developer to join our team...",
          postedDate: "2 days ago",
          url: "https://linkedin.com/jobs/123",
          salary: "$80,000 - $120,000",
        },
        {
          title: "Full Stack Engineer",
          company: "StartupXYZ",
          location: "Remote",
          description: "Join our growing team as a Full Stack Engineer...",
          postedDate: "1 week ago",
          url: "https://linkedin.com/jobs/456",
          salary: "$90,000 - $140,000",
        },
        {
          title: "Software Developer",
          company: "Enterprise Solutions",
          location: "New York, NY",
          description: "Looking for a Software Developer with experience in...",
          postedDate: "3 days ago",
          url: "https://linkedin.com/jobs/789",
        },
      ]

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setJobs(mockJobs)
    } catch (error) {
      console.error("Error searching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Search
          </CardTitle>
          <CardDescription>Search for relevant job opportunities based on your criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={searchParams.keywords}
                onChange={(e) => setSearchParams({ ...searchParams, keywords: e.target.value })}
                placeholder="e.g., React, Frontend, JavaScript"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                placeholder="e.g., San Francisco, Remote"
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Input
                id="experience"
                value={searchParams.experience}
                onChange={(e) => setSearchParams({ ...searchParams, experience: e.target.value })}
                placeholder="e.g., Entry Level, Mid Level"
              />
            </div>
          </div>

          <Button onClick={searchJobs} disabled={loading || !searchParams.keywords} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching Jobs...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Jobs
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {jobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Found {jobs.length} job opportunities</h3>
          {jobs.map((job, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="text-base font-medium text-gray-700">{job.company}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Job
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.postedDate}
                    </div>
                    {job.salary && <Badge variant="secondary">{job.salary}</Badge>}
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {jobs.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Enter search criteria and click "Search Jobs" to find opportunities</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
