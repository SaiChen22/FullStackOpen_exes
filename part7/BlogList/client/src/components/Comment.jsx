// src/components/Comments.jsx
import { useState } from 'react'

const Comments = ({ comments, onAddComment }) => {
  const [comment, setComment] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!comment.trim()) return

    onAddComment(comment)
    setComment('')
  }

  return (
    <div>
      <h3>comments</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {comments.map((c, index) => (
          // 评论是匿名的、没有唯一 id，暂用 index 做 key
          <li key={index}>{typeof c === 'string' ? c : c.content}</li>
        ))}
      </ul>
    </div>
  )
}

export default Comments