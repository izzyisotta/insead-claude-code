'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleSignIn = async () => {
    if (!email) return
    const origin = window.location.origin
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: origin + '/auth/callback',
      },
    })
    if (!error) setEmailSent(true)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return <div className="h-9 w-24 rounded-md bg-[var(--bg-card)] animate-pulse" />
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--text-secondary)]">
          {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
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

  if (emailSent) {
    return (
      <span className="text-sm text-[var(--accent)]">
        Check your email for a login link
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
        className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm text-[var(--text)] placeholder-[var(--text-secondary)] w-48 focus:outline-none focus:border-[var(--accent)]"
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
