import AnalysisForm from "@/components/AnalysisForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            JobFit
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            AI-powered resume and job description matching. Upload your CV and job posting to get an instant compatibility score.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>PDF & DOCX Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Instant Results</span>
            </div>
          </div>
        </header>

        {/* Main Form */}
        <main>
          <AnalysisForm />
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>
            JobFit uses AI to extract and analyze data from your documents. No data is stored permanently.
          </p>
          <p className="mt-2">
            Powered by Gemini AI & Groq
          </p>
        </footer>
      </div>
    </div>
  );
}
