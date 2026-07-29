import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import logger from './logger.js'

const unknownEndpoint = (request, response) => {
  logger.info('Unknown endpoint:', request.path)
  response.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    // 处理用户名重复的错误
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }else if(error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } 

  next(error)
}
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}
const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (decodedToken.id) {
      request.user = await User.findById(decodedToken.id)
    }
  }

  next()
}

export default {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}