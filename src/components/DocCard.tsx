import Link from 'next/link'
import CategoryTag from './CategoryTag'
import type { Document } from '@/lib/types'

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

export default function DocCard({ doc }: { doc: Document }) {
  const authorName = doc.author_name
  const authorSlug = authorName.toLowerCase().replace(/\s+/g, '-')
  const date = new Date(doc.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5 flex flex-col gap-3 hover:border-[var(--accent)] transition-colors">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)]">
          <span>{typeIcons[doc.type]}</span>
          {typeLabels[doc.type]}
        </span>
        <span className="text-xs text-[var(--text-secondary)]">{date}</span>
      </div>

      <Link href={`/docs/${doc.id}`} className="group">
        <h3 className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
          {doc.title}
        </h3>
      </Link>

      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{doc.description}</p>

      <div className="flex items-center gap-2 text-sm">
        <Link
          href={`/people/${authorSlug}`}
          className="text-[var(--accent)] hover:underline"
        >
          {authorName}
        </Link>
      </div>

      {doc.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
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
          className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline mt-auto"
        >
          Visit &rarr;
        </a>
      )}
    </div>
  )
}
