"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true)
      setError(event.error)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-blue-50/20 dark:to-slate-900/40 flex items-center justify-center px-4">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-8 max-w-md w-full">
          <h2 className="text-xl font-bold text-destructive mb-2">Something went wrong</h2>
          <p className="text-destructive/80 mb-4">
            An unexpected error occurred. Please refresh the page and try again.
          </p>
          {error && <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">{error.message}</p>}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition font-medium"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return children
}
