import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CategoryTag from '@/components/CategoryTag'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import type { Document } from '@/lib/types'

export const dynamic = 'force-dynamic'

const typeIcons: Record<string, string> = {
  workflow: '🔄',
  tool: '🛠',
  skill: '⚡',
  resource: '📎',
}

const typeLabels: Record<string, string> = {
  workflow: 'Workflow',
  tool: 'Tool',
  skill: 'Skill',
  resource: 'Resource',
}

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('documents')
    .select('*, profiles(*)')
    .eq('id', id)
    .single()

  if (!data) {
    notFound()
  }

  const doc = data as Document
  const authorName = doc.profiles?.name ?? 'Unknown'
  const authorId = doc.profiles?.id ?? doc.author_id
  const date = new Date(doc.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-card)] px-3 py-1 text-sm font-medium text-[var(--text-secondary)] border border-[var(--border)]">
            <span>{typeIcons[doc.type]}</span>
            {typeLabels[doc.type]}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-[var(--text)] mb-3">{doc.title}</h1>
        <p className="text-lg text-[var(--text-secondary)] mb-4">{doc.description}</p>

        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
          <Link href={`/people/${authorId}`} className="text-[var(--accent)] hover:underline">
            {authorName}
          </Link>
          <span>|</span>
          <span>{date}</span>
        </div>

        {doc.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {doc.categories.map((cat) => (
              <CategoryTag key={cat} category={cat} />
            ))}
          </div>
        )}

        {doc.link && (
          <a
            href={doc.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-4 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Visit &rarr;
          </a>
        )}
      </div>

      {/* Content */}
      {doc.content && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8">
          <MarkdownRenderer content={doc.content} />
        </div>
      )}
    </div>
  )
}
