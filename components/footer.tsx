export default function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-gray-200 bg-white/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">PortfolioAI</h3>
            <p className="text-sm text-gray-600">AI-powered tools for job applications and career development.</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Privacy & Security</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• No data stored permanently</li>
              <li>• Files processed in memory only</li>
              <li>• Secure authentication via Supabase</li>
              <li>• AI processing via Groq API</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Tools Available</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Portfolio Generator</li>
              <li>• Cover Letter Generator</li>
              <li>• Resume Analyzer & Enhancer</li>
              <li>• Mock Interview Practice</li>
              <li>• Job Search</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">© 2025 PortfolioAI. Built with Next.js, Supabase, and Groq AI.</p>
        </div>
      </div>
    </footer>
  )
}
