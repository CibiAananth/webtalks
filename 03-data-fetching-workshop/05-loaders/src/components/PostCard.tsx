import type { Post } from '../types'

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p className="body">{post.body}</p>
      <span className="meta">{new Date(post.createdAt).toLocaleDateString()}</span>
    </div>
  )
}
