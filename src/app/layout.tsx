import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import AuthButton from '@/components/AuthButton'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'INSEAD Claude Code',
  description: 'A shared knowledge base for the INSEAD Claude Code community',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist-sans)]">
        <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-lg font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                INSEAD CC
              </Link>
              <div className="hidden sm:flex items-center gap-4">
                <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                  Home
                </Link>
                <Link href="/people" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                  People
                </Link>
                <Link href="/categories" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                  Categories
                </Link>
              </div>
            </div>
            <AuthButton />
          </div>
        </nav>
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text-secondary)]">
          INSEAD Claude Code Community
        </footer>
      </body>
    </html>
  )
}
