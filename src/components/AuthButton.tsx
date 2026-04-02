'use client'

import { useEffect, useState } from 'react'

interface LocalUser {
  name: string
}

function getStoredUser(): LocalUser | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('cc-user')
  if (stored) {
    try { return JSON.parse(stored) } catch { return null }
  }
  return null
}

export default function AuthButton() {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getStoredUser())
    setLoading(false)
  }, [])

  const handleSignIn = () => {
    if (!name.trim()) return
    const u = { name: name.trim() }
    localStorage.setItem('cc-user', JSON.stringify(u))
    setUser(u)
    setName('')
  }

  const handleSignOut = () => {
    localStorage.removeItem('cc-user')
    setUser(null)
  }

  if (loading) {
    return <div className="h-9 w-24 rounded-md bg-[var(--bg-card)] animate-pulse" />
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--text-secondary)]">
          {user.name}
        </span>
        <a
          href="/new"
          className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          New Post
        </a>
        <button
          onClick={handleSignOut}
          className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
        className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm text-[var(--text)] placeholder-[var(--text-secondary)] w-40 focus:outline-none focus:border-[var(--accent)]"
      />
      <button
        onClick={handleSignIn}
        className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
      >
        Sign in
      </button>
    </div>
  )
}
