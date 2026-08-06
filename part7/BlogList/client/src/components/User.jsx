// src/components/User.jsx
const User = ({ user, blogs }) => {
  if (!user) {
    return null
  }

  // blogs 是全部博客列表，这里筛选出属于当前 user 的
  const userBlogs = blogs.filter((blog) => {
    const blogOwnerId = typeof blog.user === 'string' ? blog.user : blog.user?.id
    return blogOwnerId === user.id
  })

  return (
    <div>
      <h2>{user.name || user.username}</h2>
      <h3>added blogs</h3>
      <ul>
        {userBlogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User