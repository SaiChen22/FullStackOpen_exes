import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import express from 'express'
import User from '../models/user.js'

const loginRouter = express.Router()

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  console.log(username, password)

  // 1. 查找用户是否存在
  const user = await User.findOne({ username })

  // 2. 校验密码是否正确
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // 3. 构建 payload 并生成 token
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  // 4. 返回 token 以及基本用户信息
  response
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user._id })
})

export default loginRouter