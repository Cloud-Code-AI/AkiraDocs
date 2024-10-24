import { getDocById } from '@/lib/docs'
import { BlockRenderer } from '@/components/content/renderers/BlockRenderer'

export default function DocPage({ params }: { params: { id: string } }) {
  const post = getDocById(params.id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-8">By {post.author} on {post.date}</p>
      {post.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}