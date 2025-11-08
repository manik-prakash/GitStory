"use client"

import { useState } from "react"
import { GitHubInput } from "@/components/github-input"
import { TimelineDisplay } from "@/components/timeline-display"
import { YearSummary } from "@/components/year-summary"
import { ErrorBoundary } from "@/components/error-boundary"
import { ErrorAlert } from "@/components/error-alert"

interface Repository {
  id: number
  name: string
  description: string | null
  created_at: string
  url: string
}

export default function Home() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")

  const handleSearch = async (user: string) => {
    setUsername(user)
    setLoading(true)
    setError("")
    setRepos([])

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`/api/github?username=${encodeURIComponent(user)}`, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const data = await response.json()
        const errorMessage = data.error || `HTTP Error ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (!Array.isArray(data.repositories)) {
        throw new Error("Invalid response format from server")
      }

      setRepos(data.repositories)
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          setError("Request timed out. GitHub may be slow or unreachable. Please try again.")
        } else {
          setError(err.message)
        }
      } else {
        setError("An unexpected error occurred")
      }
      setRepos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-linear-to-br from-background via-background to-blue-50/20 dark:to-slate-900/40">
        <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">GitHub Timeline</h1>
            <p className="text-lg text-muted-foreground">
              Visualize your GitHub repository history in an elegant timeline format
            </p>
          </div>


          <div className="mb-12">
            <GitHubInput onSearch={handleSearch} loading={loading} />
          </div>


          {error && <ErrorAlert message={error} onDismiss={() => setError("")} />}

          {repos.length > 0 && !loading && (
            <div className="space-y-8">
              <YearSummary repos={repos} />
              <TimelineDisplay repos={repos} username={username} />
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {!loading && repos.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Enter a GitHub username to get started</p>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  )
}
