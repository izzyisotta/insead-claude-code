import Link from 'next/link'

function hashToHue(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }
  return Math.abs(hash) % 360
}

export default function CategoryTag({ category }: { category: string }) {
  const hue = hashToHue(category)
  const slug = encodeURIComponent(category.toLowerCase())

  return (
    <Link
      href={`/categories/${slug}`}
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80"
      style={{
        backgroundColor: `hsl(${hue}, 50%, 20%)`,
        color: `hsl(${hue}, 80%, 75%)`,
        border: `1px solid hsl(${hue}, 50%, 30%)`,
      }}
    >
      {category}
    </Link>
  )
}
