
export const validateGitHubUsername = (username: string): { valid: boolean; error?: string } => {
  const trimmed = username.trim()

  if (!trimmed) {
    return { valid: false, error: "Username cannot be empty" }
  }

  if (trimmed.length < 1 || trimmed.length > 39) {
    return { valid: false, error: "GitHub username must be between 1-39 characters" }
  }

  const validPattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/
  if (!validPattern.test(trimmed)) {
    return {
      valid: false,
      error: "Username can only contain alphanumeric characters and hyphens, and cannot start or end with a hyphen",
    }
  }

  return { valid: true }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return "An unexpected error occurred. Please try again."
}
