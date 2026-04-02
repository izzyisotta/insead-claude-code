import { createClient } from '@/lib/supabase/server'
import DocCard from '@/components/DocCard'
import type { Document } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = decodeURIComponent(slug)
  const supabase = await createClient()

  const { data: docs } = await supabase
    .from('documents')
    .select('*')
    .contains('categories', [category])
    .order('created_at', { ascending: false })

  const documents = (docs as Document[]) ?? []

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-[var(--text)]">{category}</h1>
      <p className="text-[var(--text-secondary)] mb-6">
        {documents.length} post{documents.length !== 1 ? 's' : ''} in this category
      </p>

      {documents.length === 0 ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
          <p className="text-[var(--text-secondary)]">No posts in this category yet.</p>
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
