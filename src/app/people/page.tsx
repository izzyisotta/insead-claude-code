import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function PeoplePage() {
  const supabase = await createClient()

  // Get distinct authors who have documents, with their profiles
  const { data: docs } = await supabase
    .from('documents')
    .select('author_id, profiles(id, name, email, avatar_url, created_at)')

  // Deduplicate by author
  const profileMap = new Map<string, Profile>()
  const docCounts = new Map<string, number>()
  if (docs) {
    for (const doc of docs) {
      const profile = doc.profiles as unknown as Profile
      if (profile) {
        profileMap.set(profile.id, profile)
        docCounts.set(profile.id, (docCounts.get(profile.id) || 0) + 1)
      }
    }
  }

  const contributors = Array.from(profileMap.values())

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[var(--text)]">People</h1>

      {contributors.length === 0 ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
          <p className="text-[var(--text-secondary)]">No contributors yet. Posts will show their authors here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {contributors.map((person) => (
            <Link
              key={person.id}
              href={`/people/${person.id}`}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5 hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex items-center gap-3">
                {person.avatar_url ? (
                  <img
                    src={person.avatar_url}
                    alt={person.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--border)] flex items-center justify-center text-sm font-medium text-[var(--text-secondary)]">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-[var(--text)]">{person.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {docCounts.get(person.id) || 0} post{(docCounts.get(person.id) || 0) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
