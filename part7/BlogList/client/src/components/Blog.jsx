// src/components/Blog.jsx
import Comments from './Comment'
const Blog = ({ blog, updateLike, deleteBlog, currentUser,addComment }) => {
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removeButtonStyle = {
    backgroundColor: '#008CBA',
    color: 'white',
    border: 'none',
    borderRadius: 3,
    padding: '3px 8px',
    cursor: 'pointer',
    marginTop: 5
  }

  

  const blogOwnerId = typeof blog.user === 'string' ? blog.user : blog.user?.id
  const blogOwnerUsername = typeof blog.user === 'string' ? null : blog.user?.username
  const showDeleteButton = currentUser && (
    blogOwnerId === currentUser.id || blogOwnerUsername === currentUser.username
  )
  const showLikeButton = Boolean(currentUser)

  return (
    <div style={blogStyle}>
      <div>
        <h2>{blog.title}</h2>
        <p>{blog.author}</p>
      </div>

      <div>
        <div>{blog.url}</div>
        <div>likes {blog.likes}</div>
        <div>{blog.user ? blog.user.name || blog.user.username : ''}</div>

        {showLikeButton && (
          <div>
            <button type="button" onClick={() => updateLike(blog.id)}>like</button>
          </div>
        )}

        {showDeleteButton && (
          <div>
            <button style={removeButtonStyle} onClick={() => deleteBlog(blog)}>
              delete
            </button>
          </div>
        )}
        </div>

        <Comments comments={blog.comments || []} onAddComment={(comment) => addComment(blog.id, comment)} />
    </div>
  )
}

export default Blog