"use client"

import type React from "react"
import { validateGitHubUsername } from "@/lib/validation"
import { useState } from "react"
// import { Button } from "@/components/ui/button"

interface GitHubInputProps {
  onSearch: (username: string) => void
  loading: boolean
}

export function GitHubInput({ onSearch, loading }: GitHubInputProps) {
  const [input, setInput] = useState("")
  const [validationError, setValidationError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    const validation = validateGitHubUsername(input)
    if (!validation.valid) {
      setValidationError(validation.error || "Invalid username")
      return
    }

    onSearch(input.trim())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    if (validationError) {
      setValidationError("")
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter GitHub username (e.g., torvalds)"
          className={`flex-1 px-4 py-3 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition ${
            validationError ? "border-red-500 focus:ring-red-500/50" : "border-border focus:ring-primary/50"
          }`}
          disabled={loading}
          aria-invalid={!!validationError}
          aria-describedby={validationError ? "input-error" : undefined}
        />
        <button 
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition"
        >
          {loading ? "Loading..." : "Generate Timeline"}
        </button>
      </form>
      {validationError && (
        <p id="input-error" className="text-red-500 text-sm mt-2">
          {validationError}
        </p>
      )}
    </div>
  )
}
