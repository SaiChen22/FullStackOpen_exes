import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import config from './utils/config.js'
import logger from './utils/logger.js'
import middleware from './utils/middleware.js'
import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'

const app = express()

logger.info('Application started')

mongoose.connect(config.MONGODB_URI, {family: 4})
        .then(() => {
            logger.info('Connected to MongoDB')
        })
        .catch((error) => {
            logger.error('Error connecting to MongoDB:', error)
        })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app