import express from 'express'
import morgan from 'morgan'
import cors from 'cors'


const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', request => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let phoneBook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/phonebook', (request, response) => {
  response.json(phoneBook)
})

app.get('/api/phonebook/:id', (request, response) => {
  const id = request.params.id
  const note = phoneBook.find(n => n.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const now = new Date()
  const numNotes = phoneBook.length
  response.send(`This phonebook contains ${numNotes} notes.<br>
    ${now}`)
})

app.delete('/api/phonebook/:id', (request, response) => {
    const id = request.params.id
    const note = phoneBook.find(n => n.id === id)
    if (!note) {
      return response.status(404).end()
    }
    phoneBook = phoneBook.filter(n => n.id !== id)
    response.status(204).end()
  })

app.post('/api/phonebook', (request, response) => {
    const id = Math.floor(Math.random() * 1000000).toString()
    const { name, number } = request.body
    if (!name || !number) {
      return response.status(400).json({ error: 'Name and number are required' })
    }
    if (phoneBook.some(n => n.name === name)) {
      return response.status(400).json({ error: 'Name must be unique' })
    }
    const newPerson = { id, name, number }
    phoneBook = [...phoneBook, newPerson]
    response.json(newPerson)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


