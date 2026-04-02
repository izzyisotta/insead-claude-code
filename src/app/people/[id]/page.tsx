import { createClient } from '@/lib/supabase/server'
import DocCard from '@/components/DocCard'
import { notFound } from 'next/navigation'
import type { Document } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params
  const supabase = await createClient()

  // Fetch all documents and find those whose slugified author_name matches the URL slug
  const { data: docs } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  const documents = ((docs as Document[]) ?? []).filter(
    (doc) => doc.author_name.toLowerCase().replace(/\s+/g, '-') === slug
  )

  if (documents.length === 0) {
    notFound()
  }

  const authorName = documents[0].author_name

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-[var(--border)] flex items-center justify-center text-2xl font-medium text-[var(--text-secondary)]">
          {authorName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">{authorName}</h1>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-[var(--text)]">Posts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <DocCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  )
}
