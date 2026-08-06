import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import app from '../app.js'
import User from '../models/user.js'
import { initialUsers } from './test_helper.js'

const api = supertest(app)

describe('when there are initially users in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

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
  })

  test('creation fails with 400 if username is too short', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'ab',
      name: 'Short Name',
      password: 'validpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(result.body.error.includes('at least 3 characters long'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with 400 if password is too short', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'validusername',
      name: 'Valid Name',
      password: '12'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(result.body.error.includes('at least 3 characters long'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with 400 if username is not unique', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'root', // 数据库中已存在
      name: 'Duplicate Root',
      password: 'password123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})