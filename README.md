# PortfolioAI v2 - AI-Powered Job Application Tool Suite

A comprehensive suite of AI-powered tools designed to assist early-career engineers and career-switchers with job applications, resume optimization, and interview preparation.

## Features

- **Portfolio Generator**: Create professional portfolio websites from resumes
- **Cover Letter Generator**: Generate tailored cover letters for specific jobs
- **Resume Analyzer**: Analyze ATS compatibility and get improvement suggestions
- **Resume Enhancer**: AI-optimized resume improvements
- **Job Search**: Search for relevant job opportunities
- **Mock Interview**: Practice interviews with AI-powered feedback

## Tech Stack

- **Frontend**: Next.js 14 with React
- **Authentication**: Supabase
- **AI Processing**: Groq API via AI SDK
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## Environment Variables

The following environment variables are required:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq AI Configuration
GROQ_API_KEY=your_groq_api_key
\`\`\`

## Deployment

1. **Vercel Deployment** (Recommended):
   - Connect your GitHub repository to Vercel
   - Add the required environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

2. **Local Development**:
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

## Privacy & Security

- **Stateless Operation**: No user data is stored permanently
- **File Processing**: Files are processed in memory only during AI operations
- **Secure Authentication**: Managed by Supabase with social login options
- **API Security**: All AI processing happens server-side with secure API keys

## Usage

1. **Sign In**: Use Google or GitHub to authenticate
2. **Select Tool**: Choose from the available AI-powered tools
3. **Upload/Input**: Provide your resume and/or job description
4. **Generate**: Get AI-powered results instantly
5. **Download**: Save generated content for your applications

## Architecture

The application follows a stateless architecture where:
- User authentication is handled by Supabase
- AI processing is performed by Groq API
- No user data is persisted beyond the session
- Each tool operates independently

## Contributing

This is a production-ready application. For feature requests or bug reports, please create an issue in the repository.

## License

MIT License - see LICENSE file for details.
