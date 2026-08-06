import app from './app.js'
import logger from './utils/logger.js'
import config from './utils/config.js'

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString()})
})

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')))
    app.get('/*splat', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'))
    })
}

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})

