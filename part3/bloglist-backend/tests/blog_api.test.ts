import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import app from '../app.js'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import { initialBlogs, initialUsers, blogsInDb } from './test_helper.js'

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  let token = ''

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // 1. 创建测试用户
    const userObjects = await Promise.all(
      initialUsers.map(async user => {
        const passwordHash = await bcrypt.hash(user.password, 10)
        return new User({
          username: user.username,
          name: user.name,
          passwordHash
        })
      })
    )

    const savePromises = userObjects.map(user => user.save())
    await Promise.all(savePromises)
    const rootUser = userObjects.find(user => user.username === 'root')

    // 2. 登录获取 token
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    token = loginResponse.body.token

    // 3. 将初始化博客绑定到该测试用户
    const blogObjects = initialBlogs.map(blog => new Blog({ ...blog, user: rootUser._id }))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json and in correct amount', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added with a valid token', async () => {
      const newBlog = {
        title: 'Canonical stack overflow keys',
        author: 'Joel Spolsky',
        url: 'https://joelonsoftware.com',
        likes: 12
      }

      // 带有 Authorization Header 发送 POST 请求
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert.ok(titles.includes('Canonical stack overflow keys'))
    })

    // 4.23 新增：未提供 Token 时创建博客失败 (401 Unauthorized)
    test('adding a blog fails with status code 401 Unauthorized if token is not provided', async () => {
      const newBlog = {
        title: 'Unauthorized blog post',
        author: 'Anonymous',
        url: 'https://unauthorized.com',
        likes: 0
      }

      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert.ok(result.body.error.includes('token missing or invalid'))

      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })

    test('if likes property is missing, it defaults to 0', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('blog without title is rejected with status code 400', async () => {
      const newBlog = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})