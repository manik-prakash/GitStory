"use client"

interface Repository {
  id: number
  name: string
  description: string | null
  created_at: string
  url: string
}

interface YearSummaryProps {
  repos: Repository[]
}

export function YearSummary({ repos }: YearSummaryProps) {
  // Group repos by year and calculate statistics
  const yearStats = repos.reduce(
    (acc, repo) => {
      const year = new Date(repo.created_at).getFullYear()
      if (!acc[year]) {
        acc[year] = { count: 0, repos: [] }
      }
      acc[year].count += 1
      acc[year].repos.push(repo)
      return acc
    },
    {} as Record<number, { count: number; repos: Repository[] }>,
  )

  // Sort years in descending order
  const sortedYears = Object.entries(yearStats).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))

  const maxCount = Math.max(...Object.values(yearStats).map((s) => s.count))
  const totalRepos = repos.length
  const avgReposPerYear = sortedYears.length > 0 ? (totalRepos / sortedYears.length).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Repositories</p>
          <p className="text-3xl font-bold text-foreground mt-2">{totalRepos}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground">Active Years</p>
          <p className="text-3xl font-bold text-foreground mt-2">{sortedYears.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground">Average per Year</p>
          <p className="text-3xl font-bold text-foreground mt-2">{avgReposPerYear}</p>
        </div>
      </div>

      {/* Year Distribution Chart */}
      <div className="bg-card border border-border rounded-lg p-8">
        <h2 className="text-2xl font-bold text-foreground mb-8">Repositories by Year</h2>

        <div className="space-y-4">
          {sortedYears.map(([year, { count }]) => {
            const percentage = (count / maxCount) * 100
            return (
              <div key={year} className="flex items-end gap-4">
                <div className="w-12 font-semibold text-right text-foreground">{year}</div>
                <div className="flex-1">
                  <div className="h-8 bg-muted rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-primary to-blue-500 rounded-lg transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <div className="font-semibold text-foreground">{count}</div>
                  <div className="text-xs text-muted-foreground">{((count / totalRepos) * 100).toFixed(0)}%</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
