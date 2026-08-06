// src/stores/userStore.js
import { create } from 'zustand'
import loginService from '../services/login'
import blogService from '../services/blogs'
import usersService from '../services/users' // 新增

const useUserStore = create((set) => ({
  user: null,
  users: [], // 新增：全部用户列表

  initializeUser: () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      set({ user })
      blogService.setToken(user.token)
    }
  },

  // 新增：加载全部用户
  initializeUsers: async () => {
    const users = await usersService.getAll()
    set({ users })
  },

  login: async (credentials) => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)
    set({ user })
    return user
  },

  logout: () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    set({ user: null })
  }
}))

export default useUserStore