'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { DocType } from '@/lib/types'

function getStoredUser(): { name: string } | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('cc-user')
  if (stored) {
    try { return JSON.parse(stored) } catch { return null }
  }
  return null
}

export default function NewPostPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<DocType>('workflow')
  const [categoriesInput, setCategoriesInput] = useState('')
  const [content, setContent] = useState('')
  const [link, setLink] = useState('')

  useEffect(() => {
    const user = getStoredUser()
    if (user) {
      setUserName(user.name)
    } else {
      router.push('/')
    }
    setLoading(false)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName) return

    setSubmitting(true)
    setError(null)

    const categories = categoriesInput
      .split(',')
      .map((c) => c.trim().toLowerCase())
      .filter((c) => c.length > 0)

    const { data, error: insertError } = await supabase
      .from('documents')
      .insert({
        author_name: userName,
        title,
        description,
        type,
        categories,
        content,
        link: link || null,
      })
      .select('id')
      .single()

    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }

    if (data) {
      router.push(`/docs/${data.id}`)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-[var(--bg-card)] rounded" />
          <div className="h-64 bg-[var(--bg-card)] rounded" />
        </div>
      </div>
    )
  }

  if (!userName) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-[var(--text)]">New Post</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">Posting as {userName}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[var(--text)] mb-1.5">Title</label>
          <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            placeholder="My Claude Code Workflow" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[var(--text)] mb-1.5">Description</label>
          <input id="description" type="text" required value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            placeholder="A brief description of what this is about" />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-[var(--text)] mb-1.5">Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value as DocType)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]">
            <option value="workflow">🔄 Workflow</option>
            <option value="tool">🛠 Tool</option>
            <option value="skill">⚡ Skill</option>
            <option value="resource">📎 Resource</option>
          </select>
        </div>

        <div>
          <label htmlFor="categories" className="block text-sm font-medium text-[var(--text)] mb-1.5">Categories</label>
          <input id="categories" type="text" value={categoriesInput} onChange={(e) => setCategoriesInput(e.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            placeholder="productivity, automation, obsidian (comma-separated)" />
          <p className="text-xs text-[var(--text-secondary)] mt-1">Separate categories with commas</p>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-[var(--text)] mb-1.5">Content (Markdown)</label>
          <textarea id="content" required rows={14} value={content} onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] font-mono text-sm"
            placeholder="Write your post in Markdown..." />
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-[var(--text)] mb-1.5">Link (optional)</label>
          <input id="link" type="url" value={link} onChange={(e) => setLink(e.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]"
            placeholder="https://github.com/..." />
          <p className="text-xs text-[var(--text-secondary)] mt-1">For tools or resources, link to the source</p>
        </div>

        {error && (
          <div className="rounded-md bg-red-900/30 border border-red-800 p-3 text-sm text-red-300">{error}</div>
        )}

        <button type="submit" disabled={submitting}
          className="w-full rounded-md bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? 'Publishing...' : 'Publish'}
        </button>
      </form>
    </div>
  )
}
