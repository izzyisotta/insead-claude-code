import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PeoplePage() {
  const supabase = await createClient()

  // Get all documents to extract unique author names
  const { data: docs } = await supabase
    .from('documents')
    .select('author_name')

  // Deduplicate by author_name and count docs
  const docCounts = new Map<string, number>()
  if (docs) {
    for (const doc of docs) {
      if (doc.author_name) {
        docCounts.set(doc.author_name, (docCounts.get(doc.author_name) || 0) + 1)
      }
    }
  }

  const contributors = Array.from(docCounts.keys())

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[var(--text)]">People</h1>

      {contributors.length === 0 ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
          <p className="text-[var(--text-secondary)]">No contributors yet. Posts will show their authors here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {contributors.map((name) => {
            const slug = name.toLowerCase().replace(/\s+/g, '-')
            const count = docCounts.get(name) || 0
            return (
              <Link
                key={name}
                href={`/people/${slug}`}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5 hover:border-[var(--accent)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--border)] flex items-center justify-center text-sm font-medium text-[var(--text-secondary)]">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text)]">{name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {count} post{count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
