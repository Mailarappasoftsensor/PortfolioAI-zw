// Rough estimation: 1 token ≈ 4 characters for English text
const CHARS_PER_TOKEN = 4
const MAX_TOKENS = 4000 // Leave room for the prompt and response
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
  return text.substring(0, maxChars - 100) + "\n\n[Content truncated due to length...]"
}

export function validateInputSize(
  resume: string,
  jobDescription?: string,
): {
  isValid: boolean
  message?: string
  truncatedResume?: string
  truncatedJobDescription?: string
} {
  const resumeTokens = estimateTokens(resume)
  const jobDescTokens = jobDescription ? estimateTokens(jobDescription) : 0
  const totalTokens = resumeTokens + jobDescTokens

  // Reserve tokens for prompt and response (about 1000 tokens)
  const maxInputTokens = 3000

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
    message: `Input too large (${totalTokens} tokens). Content has been automatically truncated to fit within limits.`,
    truncatedResume: truncateText(resume, maxResumeTokens),
    truncatedJobDescription: jobDescription ? truncateText(jobDescription, maxJobDescTokens) : undefined,
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
