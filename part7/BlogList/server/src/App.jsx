// src/App.jsx
import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useNavigate, useMatch} from "react-router-dom";

import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Login from "./components/Login";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Notification state
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  const blogFormRef = useRef();

  const notify = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, 5000);
  };

  // Fetch blogs on initial load
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // Check local storage for logged-in user session
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // Handle Login (Exercise 5.1 & 5.2)
  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      notify(`Welcome back, ${user.name || user.username}`);
    } catch {
      notify("Wrong username or password", "error");
    }
    
    navigate("/");
  };

  // Handle Logout (Exercise 5.2)
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    setUser(null);
    notify("Logged out successfully");
    navigate("/");
  };

  // 接收 BlogForm 传来的 blogObject
  const addBlog = async (blogObject) => {
    try {
      // 隐匿 Togglable 表单 (搭配 5.5 步骤)
      if (blogFormRef.current) {
        blogFormRef.current.toggleVisibility();
      }

      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      notify(
        `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
      );
    } catch {
      notify("Failed to add blog", "error");
    }
    navigate("/");
  };

  const handleLike = async (id) => {
    const blogToLike = blogs.find((b) => b.id === id);
    const updatedBlogObject = {
      user: blogToLike.user ? blogToLike.user.id || blogToLike.user : null,
      likes: blogToLike.likes + 1,
      author: blogToLike.author,
      title: blogToLike.title,
      url: blogToLike.url,
    };

    try {
      const returnedBlog = await blogService.update(id, updatedBlogObject);
      // 保留原来的 user 节点数据，防止点赞后 user 字段变成纯 ID 导致界面渲染异常
      setBlogs(
        blogs.map((b) =>
          b.id === id ? { ...returnedBlog, user: blogToLike.user } : b,
        ),
      );
    } catch {
      notify("Failed to update likes", "error");
    }
  };

  const handleDelete = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`,
    );
    if (!confirmDelete) return;

    try {
      await blogService.remove(blog.id);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
      notify(`Blog "${blog.title}" removed`);
    } catch {
      notify(
        "Failed to remove blog. Un-authorized user or expired session.",
        "error",
      );
    }
    navigate("/");
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
  const blogMatch = useMatch('/blogs/:id');
  const blogId = blogMatch ? blogMatch.params.id : null;
  const selectedBlog = blogId ? blogs.find((b) => b.id === blogId) : null;

  // Render content for authenticated user
  return (
    <div>
      <div>
        <Link to="/">Home</Link>

        <Link to="/create">Create New Blog</Link>
        {user? <button onClick={handleLogout}>logout</button>: <Link to="/login">Login</Link>}
      </div>
      <Notification message={notification.message} type={notification.type} />
      <Routes>
        <Route 
          path="/blogs/:id"
          element={
            <Blog
              blog={selectedBlog}
              updateLike={handleLike}
              deleteBlog={handleDelete}
              currentUser={user}
            />
          }
        />

        <Route
          path="/create"
          element={
            <BlogForm createBlog={addBlog} />
          }
        />

        <Route
          path="/login"
          element={
            <Login handleLogin={handleLogin} />
          }
        />

        <Route
          path="/"
          element={
            <div>
              <h2>blogs</h2>
              {user && (
                <p>
                  {user.name || user.username} logged in{" "}
                </p>
              )}

              <ul>
                {sortedBlogs.map((blog) => (
                  <Link to={`/blogs/${blog.id}`}>
                    <li key={blog.id}>
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
