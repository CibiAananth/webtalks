import type { Post } from '../types'

export function PostCard({ post }: { post: Post }) {
  return (
    <div className="post-card">
      <h4>{post.title}</h4>
      <p>{post.body}</p>
    </div>
  )
}
