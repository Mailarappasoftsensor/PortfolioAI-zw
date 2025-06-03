import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText, generateObject } from "ai"
import { z } from "zod"
import { validateInputSize, truncateText } from "@/lib/file-utils"

// Available Groq models - using models that are actually available
const LARGE_MODEL = "llama-3.1-8b-instant" // Standard model that should be available
const STANDARD_MODEL = "llama-3.1-8b-instant" // Same model for consistency

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    // Validate required environment variables
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY not found in environment variables")
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    // Validate input data
    if (!action || !data) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    console.log(`Processing AI request: ${action}`)

    switch (action) {
      case "generate-portfolio":
        return await generatePortfolio(data)
      case "generate-cover-letter":
        return await generateCoverLetter(data)
      case "analyze-resume":
        return await analyzeResume(data)
      case "enhance-resume":
        return await enhanceResume(data)
      case "mock-interview":
        return await mockInterview(data)
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("AI API Error:", error)

    // Handle specific Groq API errors
    if (error instanceof Error) {
      if (error.message.includes("Request too large")) {
        return NextResponse.json(
          {
            error: "Input too large. Please try with a shorter resume or job description.",
            details: "The content exceeds the AI model's token limit. Try reducing the text length.",
          },
          { status: 400 },
        )
      }

      if (error.message.includes("does not exist") || error.message.includes("do not have access")) {
        return NextResponse.json(
          {
            error: "AI model temporarily unavailable. Please try again.",
            details: "The AI service is experiencing issues. Please try again in a moment.",
          },
          { status: 503 },
        )
      }
    }

    return NextResponse.json(
      {
        error: "An error occurred while processing your request. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function generatePortfolio(data: { resume?: string; answers?: any }) {
  try {
    let inputText = ""

    if (data.resume) {
      // Much more aggressive truncation for free tier
      inputText = truncateText(data.resume, 1500) // Reduced significantly
    } else if (data.answers) {
      inputText = JSON.stringify(data.answers)
      // Truncate form data if too long
      if (inputText.length > 6000) {
        inputText = inputText.substring(0, 6000) + "..."
      }
    }

    const { text } = await generateText({
      model: groq(LARGE_MODEL),
      prompt: `Create a stunning, modern portfolio website using ONLY the REAL information provided in this resume/data. Do NOT use any placeholder content or sample data.

RESUME/DATA:
${inputText}

REQUIREMENTS:
1. Extract the ACTUAL name, contact info, skills, experience, projects, and education from the provided resume/data
2. Create a complete HTML file with embedded CSS
3. Use a modern, professional design with:
   - Beautiful typography (system fonts or web-safe fonts)
   - Smooth CSS transitions and hover effects
   - Professional color scheme with vibrant blues (#3b82f6, #1d4ed8) and complementary colors
   - Fully responsive design that works on all devices
   - Clean, modern layout with proper spacing
   - Subtle animations for better user experience

4. Include these sections with REAL content from the resume/data:
   - Header with actual name and contact information
   - Professional summary/about section using the actual summary
   - Skills section with the actual skills listed
   - Experience section with real job titles, companies, dates, and descriptions
   - Projects section with actual projects mentioned (if any)
   - Education section with real educational background
   - Contact section with the actual contact information

5. Design features to include:
   - Modern card-based design for projects and experience
   - Skill bars or tags for skills
   - Responsive navigation
   - Clean typography with proper hierarchy
   - Subtle shadows and modern styling

6. Make it production-ready - someone should be able to save this file and use it immediately as their portfolio website.

IMPORTANT: Use ONLY the actual information from the resume/data. Do not add fake projects, skills, or experience.

Return ONLY the complete HTML file with embedded CSS. Do not include any explanations or markdown formatting.`,
      maxTokens: 2000, // Reduced significantly for free tier
    })

    return NextResponse.json({ portfolio: text })
  } catch (error) {
    console.error("Portfolio generation error:", error)
    throw error
  }
}

async function generateCoverLetter(data: { resume: string; jobDescription: string }) {
  try {
    const validation = validateInputSize(data.resume, data.jobDescription, 2000) // Much smaller limit

    const resume = validation.truncatedResume || data.resume
    const jobDesc = validation.truncatedJobDescription || data.jobDescription

    const { text } = await generateText({
      model: groq(LARGE_MODEL),
      prompt: `Create a cover letter based on:
      
      RESUME: ${resume}
      JOB: ${jobDesc}
      
      Write a professional 3-paragraph cover letter that highlights relevant experience.
      
      ${validation.message ? `Note: ${validation.message}` : ""}`,
      maxTokens: 800, // Reduced for free tier
    })

    return NextResponse.json({
      coverLetter: text,
      warning: validation.message,
    })
  } catch (error) {
    console.error("Cover letter generation error:", error)
    throw error
  }
}

async function analyzeResume(data: { resume: string; jobDescription: string }) {
  try {
    const validation = validateInputSize(data.resume, data.jobDescription, 2000) // Much smaller limit

    const resume = validation.truncatedResume || data.resume
    const jobDesc = validation.truncatedJobDescription || data.jobDescription

    const analysisSchema = z.object({
      atsScore: z.number().min(0).max(100),
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      missingKeywords: z.array(z.string()),
      recommendations: z.array(z.string()),
    })

    const { object } = await generateObject({
      model: groq(LARGE_MODEL),
      schema: analysisSchema,
      prompt: `Analyze resume vs job description:
      
      RESUME: ${resume}
      JOB: ${jobDesc}
      
      Provide:
      - ATS score (0-100)
      - 3 strengths
      - 3 improvements
      - 5 missing keywords
      - 3 recommendations`,
      maxTokens: 800, // Reduced for free tier
    })

    return NextResponse.json({
      analysis: object,
      warning: validation.message,
    })
  } catch (error) {
    console.error("Resume analysis error:", error)
    throw error
  }
}

async function enhanceResume(data: { resume: string; jobDescription: string }) {
  try {
    const validation = validateInputSize(data.resume, data.jobDescription, 2000) // Much smaller limit

    const resume = validation.truncatedResume || data.resume
    const jobDesc = validation.truncatedJobDescription || data.jobDescription

    const { text } = await generateText({
      model: groq(LARGE_MODEL),
      prompt: `Enhance this resume for the job:
      
      RESUME: ${resume}
      JOB: ${jobDesc}
      
      Improve the resume by:
      - Adding relevant keywords
      - Strengthening bullet points
      - Better formatting
      
      ${validation.message ? `Note: ${validation.message}` : ""}`,
      maxTokens: 1200, // Reduced for free tier
    })

    return NextResponse.json({
      enhancedResume: text,
      warning: validation.message,
    })
  } catch (error) {
    console.error("Resume enhancement error:", error)
    throw error
  }
}

async function mockInterview(data: { role: string; jobDescription?: string; question?: string; answer?: string }) {
  try {
    if (data.question && data.answer) {
      const answer = truncateText(data.answer, 800) // Reduced

      const { text } = await generateText({
        model: groq(STANDARD_MODEL),
        prompt: `Provide feedback on this interview answer:
        
        QUESTION: ${data.question}
        ANSWER: ${answer}
        ROLE: ${data.role}
        
        Give constructive feedback on clarity, relevance, and improvement areas.`,
        maxTokens: 600, // Reduced for free tier
      })

      return NextResponse.json({ feedback: text })
    } else {
      const jobDesc = data.jobDescription ? truncateText(data.jobDescription, 800) : ""

      const { text } = await generateText({
        model: groq(STANDARD_MODEL),
        prompt: `Generate 6 interview questions for ${data.role} position.
        
        ${jobDesc ? `Job: ${jobDesc}` : ""}
        
        Include technical, behavioral, and situational questions.`,
        maxTokens: 600, // Reduced for free tier
      })

      return NextResponse.json({ questions: text })
    }
  } catch (error) {
    console.error("Mock interview error:", error)
    throw error
  }
}
