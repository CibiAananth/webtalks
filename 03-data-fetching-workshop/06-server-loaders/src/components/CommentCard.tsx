import type { Comment } from '../types'

export function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="comment-card">
      <div className="comment-header">
        <span className="name">{comment.author}</span>
      </div>
      <p>{comment.text}</p>
    </div>
  )
}
