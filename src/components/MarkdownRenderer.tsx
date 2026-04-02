import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none
      prose-headings:text-[var(--text)]
      prose-p:text-[var(--text-secondary)]
      prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
      prose-strong:text-[var(--text)]
      prose-code:text-[var(--accent)] prose-code:bg-[var(--bg)] prose-code:rounded prose-code:px-1.5 prose-code:py-0.5
      prose-pre:bg-[var(--bg)] prose-pre:border prose-pre:border-[var(--border)] prose-pre:rounded-lg
      prose-blockquote:border-l-[var(--accent)] prose-blockquote:text-[var(--text-secondary)]
      prose-li:text-[var(--text-secondary)]
      prose-th:text-[var(--text)] prose-td:text-[var(--text-secondary)]
      prose-hr:border-[var(--border)]
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
