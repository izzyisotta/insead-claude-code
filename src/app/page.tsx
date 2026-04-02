import { createClient } from '@/lib/supabase/server'
import DocCard from '@/components/DocCard'
import Link from 'next/link'
import type { Document } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: docs } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12)

  // Extract unique categories from docs
  const categoryMap = new Map<string, number>()
  if (docs) {
    for (const doc of docs) {
      for (const cat of (doc as Document).categories) {
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
      }
    }
  }
  const topCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // Extract unique contributor names from documents
  const contributorSet = new Set<string>()
  if (docs) {
    for (const doc of docs) {
      if ((doc as Document).author_name) {
        contributorSet.add((doc as Document).author_name)
      }
    }
  }
  const contributors = Array.from(contributorSet)
  const documents = (docs as Document[]) ?? []

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
          INSEAD Claude Code
        </h1>
        <p className="mt-3 text-lg text-[var(--text-secondary)]">
          Workflows, tools, skills, and resources from the INSEAD community.
        </p>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main: recent docs */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">Recent Posts</h2>
          {documents.length === 0 ? (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
              <p className="text-[var(--text-secondary)]">No posts yet. Be the first to share something.</p>
              <Link
                href="/new"
                className="mt-4 inline-block rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Create a post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <DocCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-64 flex flex-col gap-6">
          {/* Contributors */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Contributors</h3>
            {contributors.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)]">No contributors yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {contributors.map((name) => (
                  <li key={name}>
                    <Link
                      href={`/people/${name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-[var(--accent)] hover:underline"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Categories */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Categories</h3>
            {topCategories.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)]">No categories yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {topCategories.map(([cat, count]) => (
                  <li key={cat} className="flex justify-between text-sm">
                    <Link
                      href={`/categories/${encodeURIComponent(cat.toLowerCase())}`}
                      className="text-[var(--accent)] hover:underline"
                    >
                      {cat}
                    </Link>
                    <span className="text-[var(--text-secondary)]">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
