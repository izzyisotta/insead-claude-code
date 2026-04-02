import { createClient } from '@/lib/supabase/server'
import DocCard from '@/components/DocCard'
import { notFound } from 'next/navigation'
import type { Profile, Document } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) {
    notFound()
  }

  const { data: docs } = await supabase
    .from('documents')
    .select('*, profiles(*)')
    .eq('author_id', id)
    .order('created_at', { ascending: false })

  const person = profile as Profile
  const documents = (docs as Document[]) ?? []

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        {person.avatar_url ? (
          <img
            src={person.avatar_url}
            alt={person.name}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[var(--border)] flex items-center justify-center text-2xl font-medium text-[var(--text-secondary)]">
            {person.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">{person.name}</h1>
          {person.email && (
            <p className="text-sm text-[var(--text-secondary)]">{person.email}</p>
          )}
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Joined {new Date(person.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">Posts</h2>

      {documents.length === 0 ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
          <p className="text-[var(--text-secondary)]">No posts yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <DocCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  )
}
