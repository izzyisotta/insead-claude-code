import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Document } from '@/lib/types'

export const dynamic = 'force-dynamic'

function hashToHue(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }
  return Math.abs(hash) % 360
}

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data: docs } = await supabase
    .from('documents')
    .select('categories')

  const categoryMap = new Map<string, number>()
  if (docs) {
    for (const doc of docs as Pick<Document, 'categories'>[]) {
      for (const cat of doc.categories) {
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
      }
    }
  }

  const categories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[var(--text)]">Categories</h1>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
          <p className="text-[var(--text-secondary)]">No categories yet. Categories appear when posts are tagged.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(([cat, count]) => {
            const hue = hashToHue(cat)
            return (
              <Link
                key={cat}
                href={`/categories/${encodeURIComponent(cat.toLowerCase())}`}
                className="rounded-lg border bg-[var(--bg-card)] p-5 hover:opacity-90 transition-opacity"
                style={{
                  borderColor: `hsl(${hue}, 50%, 30%)`,
                }}
              >
                <h3 className="font-semibold text-[var(--text)]">{cat}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {count} post{count !== 1 ? 's' : ''}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
