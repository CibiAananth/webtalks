import type { Comment } from '../types'

export default function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="comment-card">
      <strong>{comment.author}</strong>
      <p>{comment.text}</p>
    </div>
  )
}
