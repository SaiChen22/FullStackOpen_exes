// src/stores/blogStore.js
import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set, get) => ({
  blogs: [],

  // 对应原来 App.jsx 里的初始加载 useEffect
  initializeBlogs: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },

  // 对应原来的 addBlog 逻辑里"调用后端 + 更新数组"的部分
  createBlog: async (blogObject) => {
    const newBlog = await blogService.create(blogObject)
    set({ blogs: get().blogs.concat(newBlog) })
    return newBlog
  },

  likeBlog: async(id) => {
    const blogToLike = get().blogs.find((b) => b.id === id);
    if (!blogToLike) return;

    const updatedBlogObject = {
      user: blogToLike.user ? blogToLike.user.id || blogToLike.user : null,
      likes: blogToLike.likes + 1,
      author: blogToLike.author,
      title: blogToLike.title,
      url: blogToLike.url,
      comments: blogToLike.comments || []
    };

    const returnedBlog = await blogService.update(id, updatedBlogObject);
    set({ blogs: get().blogs.map((b) => b.id === id ? { ...returnedBlog, user: blogToLike.user } : b) });
  },

  deleteBlog: async(blog) => {
    const confirmDelete = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`,
    );
    if (!confirmDelete) return;

    await blogService.remove(blog.id);
    set({ blogs: get().blogs.filter((b) => b.id !== blog.id) });
  },
  addComment: async (id, comment) => {
    const blogBeforeUpdate = get().blogs.find((b) => b.id === id)
    if (!blogBeforeUpdate) return

    const updatedBlog = await blogService.createComment(id, comment)

    // 和 likeBlog 一样，后端返回的 user 字段可能只是 id，
    // 用原来的 user 对象补回去，避免界面渲染出问题
    set({
      blogs: get().blogs.map((b) =>
        b.id === id ? { ...updatedBlog, user: blogBeforeUpdate.user } : b
      ),
    })
  },
}))

export default useBlogStore