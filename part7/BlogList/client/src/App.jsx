// src/App.jsx
import { useEffect, useRef } from "react"; // 去掉了 useState
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom";

import Blog from './components/Blog';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Login from './components/Login';
import Users from './components/Users';
import User from './components/User';

import useNotificationStore from './stores/notificationStore';
import useBlogStore from './stores/blogsStore';
import useUserStore from './stores/userStore';

const App = () => {
  const blogs = useBlogStore((state) => state.blogs);
  const initializeBlogs = useBlogStore((state) => state.initializeBlogs);
  const createBlog = useBlogStore((state) => state.createBlog);
  const likeBlog = useBlogStore((state) => state.likeBlog);
  const deleteBlog = useBlogStore((state) => state.deleteBlog);
  const addComment = useBlogStore((state) => state.addComment);
  
  const user = useUserStore((state) => state.user);
  const users = useUserStore((state) => state.users); // 新增
  const initializeUser = useUserStore((state) => state.initializeUser);
  const initializeUsers = useUserStore((state) => state.initializeUsers); // 新增
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);

  const navigate = useNavigate();
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const blogFormRef = useRef();

  useEffect(() => {
    initializeBlogs();
  }, [initializeBlogs]);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  // 改用 store 的 action
  useEffect(() => {
    initializeUsers();
  }, [initializeUsers]);

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await login(credentials);
      showNotification(
        `Welcome back, ${loggedUser.name || loggedUser.username}`,
      );
    } catch {
      showNotification("Wrong username or password", "error");
    }
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    showNotification("Logged out successfully");
    navigate("/");
  };

  const addBlog = async (blogObject) => {
    try {
      if (blogFormRef.current) {
        blogFormRef.current.toggleVisibility();
      }
      const newBlog = await createBlog(blogObject);
      showNotification(
        `A new blog "${newBlog.title}" by ${newBlog.author} added`,
      );
    } catch {
      showNotification("Failed to add blog", "error");
    }
    navigate("/");
  };

  const handleAddComment = async(id,comment) => {
    try {
      await addComment(id,comment);
    } catch {
      showNotification("Failed to add comment", "error");
    }
  }

  const handleLike = async (id) => {
    try {
      await likeBlog(id);
    } catch {
      showNotification("Failed to update likes", "error");
    }
  };

  const handleDelete = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`,
    );
    if (!confirmDelete) return;

    try {
      await deleteBlog(blog);
      showNotification(`Blog "${blog.title}" removed`);
    } catch {
      showNotification(
        "Failed to remove blog. Un-authorized user or expired session.",
        "error",
      );
    }
    navigate("/");
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  const blogMatch = useMatch("/blogs/:id");
  const blogId = blogMatch ? blogMatch.params.id : null;
  const selectedBlog = blogId ? blogs.find((b) => b.id === blogId) : null;

  const userMatch = useMatch("/users/:id");
  const userId = userMatch ? userMatch.params.id : null;
  const selectedUser = userId ? users.find((u) => u.id === userId) : null;

  return (
    <div>
      <div>
        <Link to="/">Home</Link>
        <Link to="/create">Create New Blog</Link>
        <Link to="/users">Users</Link>
        {user ? (
          <button onClick={handleLogout}>logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      <Notification />

      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={selectedBlog}
              updateLike={handleLike}
              deleteBlog={handleDelete}
              currentUser={user}
              addComment={handleAddComment}
            />
          }
        />
        <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/users" element={<Users users={users} />} />
        <Route
          path="/users/:id"
          element={<User user={selectedUser} blogs={blogs} />}
        />
        <Route
          path="/"
          element={
            <div>
              <h2>blogs</h2>
              {user && <p>{user.name || user.username} logged in </p>}
              <ul>
                {sortedBlogs.map((blog) => (
                  <Link to={`/blogs/${blog.id}`} key={blog.id}>
                    <li>
                      {blog.title} by {blog.author}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
