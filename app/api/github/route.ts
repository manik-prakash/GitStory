
interface GitHubRepository {
  id: number;
  name: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  html_url: string;
}

interface SimplifiedRepository {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  url: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return Response.json({ error: "Username is required" }, { status: 400 })
  }

  if (username.length > 39) {
    return Response.json({ error: "Username is too long" }, { status: 400 })
  }

  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      signal: AbortSignal.timeout(5000),
    })

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        return Response.json({ error: `GitHub user "${username}" not found` }, { status: 404 })
      }
      return Response.json({ error: `GitHub API error: ${userResponse.status}` }, { status: 502 })
    }

    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?type=public&per_page=100&sort=created&direction=desc`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        signal: AbortSignal.timeout(5000),
      },
    )

    if (!reposResponse.ok) {
      if (reposResponse.status === 403) {
        return Response.json({ error: "GitHub API rate limit exceeded. Please try again later." }, { status: 429 })
      }
      return Response.json({ error: "Failed to fetch repositories from GitHub" }, { status: 502 })
    }

    const repos = await reposResponse.json()

    if (!Array.isArray(repos)) {
      return Response.json({ error: "Invalid response format from GitHub" }, { status: 502 })
    }

    const repositories: SimplifiedRepository[] = repos
      .filter((repo: GitHubRepository) => repo && typeof repo === "object" && !repo.fork)
      .map((repo: GitHubRepository): SimplifiedRepository => ({
        id: repo.id,
        name: repo.name || "Untitled",
        description: repo.description || null,
        created_at: repo.created_at || new Date().toISOString(),
        url: repo.html_url || "",
      }))
      .filter((repo: SimplifiedRepository) => repo.url);

    return Response.json({ repositories })
  } catch (error) {
    console.error("GitHub API error:", error)
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return Response.json({ error: "Request to GitHub timed out. Please try again." }, { status: 504 })
      }
      return Response.json({ error: `Server error: ${error.message}` }, { status: 500 })
    }
    return Response.json({ error: "Failed to fetch repositories. Please try again." }, { status: 500 })
  }
}
