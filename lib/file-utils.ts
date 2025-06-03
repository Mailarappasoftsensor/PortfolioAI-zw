export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === "string") {
        resolve(result)
      } else {
        reject(new Error("Failed to read file as text"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    // Handle different file types
    if (file.type === "application/pdf") {
      // For PDF files, we'll read as text (in a real app, you'd use a PDF parser)
      reader.readAsText(file)
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // For DOCX files, we'll read as text (in a real app, you'd use a DOCX parser)
      reader.readAsText(file)
    } else {
      // For plain text files
      reader.readAsText(file)
    }
  })
}

export const downloadFile = (content: string, filename: string, mimeType = "text/plain") => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    "text/plain",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ]
  return allowedTypes.includes(file.type)
}

export const validateFileSize = (file: File): { isValid: boolean; message?: string } => {
  const maxSize = 1 * 1024 * 1024 // Reduced to 1MB for free tier

  if (file.size > maxSize) {
    return {
      isValid: false,
      message: `File size (${formatFileSize(file.size)}) exceeds the 1MB limit. Please use a smaller file.`,
    }
  }

  return { isValid: true }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Rough estimation: 1 token ≈ 4 characters for English text
const CHARS_PER_TOKEN = 4
const MAX_TOKENS = 2000 // Much more conservative for free tier
const MAX_CHARS = MAX_TOKENS * CHARS_PER_TOKEN

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN)
}

export function truncateText(text: string, maxTokens: number = MAX_TOKENS): string {
  const maxChars = maxTokens * CHARS_PER_TOKEN

  if (text.length <= maxChars) {
    return text
  }

  // Truncate and add indication
  return text.substring(0, maxChars - 100) + "\n\n[Content truncated...]"
}

export function validateInputSize(
  resume: string,
  jobDescription?: string,
  maxInputTokens = 2000, // Much more conservative for free tier
): {
  isValid: boolean
  message?: string
  truncatedResume?: string
  truncatedJobDescription?: string
} {
  const resumeTokens = estimateTokens(resume)
  const jobDescTokens = jobDescription ? estimateTokens(jobDescription) : 0
  const totalTokens = resumeTokens + jobDescTokens

  // Reserve tokens for prompt and response
  if (totalTokens <= maxInputTokens) {
    return { isValid: true }
  }

  // If too large, truncate proportionally
  const resumeRatio = resumeTokens / totalTokens
  const jobDescRatio = jobDescTokens / totalTokens

  const maxResumeTokens = Math.floor(maxInputTokens * resumeRatio)
  const maxJobDescTokens = Math.floor(maxInputTokens * jobDescRatio)

  return {
    isValid: false,
    message: `Input too large (${totalTokens} tokens). Content has been automatically truncated to fit within free tier limits.`,
    truncatedResume: truncateText(resume, maxResumeTokens),
    truncatedJobDescription: jobDescription ? truncateText(jobDescription, maxJobDescTokens) : undefined,
  }
}
