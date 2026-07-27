import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'
import PhoneBook from './models/phonebook.js'

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', request => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/phonebook', (request, response) => {
    PhoneBook.find({}).then(phonebooks => {
      response.json(phonebooks)
    })
  })

app.get('/api/phonebook/:id', (request, response, next) => {
  const id = request.params.id
  PhoneBook.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    console.error(error)
    next(error)
  })
})

app.get('/info', (request, response) => {
  const now = new Date()
  const numNotes = PhoneBook.countDocuments()
  numNotes.then(count => {
    response.send(`This phonebook contains ${count} notes.<br>
      ${now}`)
  })
})

app.delete('/api/phonebook/:id', (request, response, next) => {
    const id = request.params.id
    PhoneBook.findByIdAndDelete(id).then(() => {
      response.status(204).end()
    }).catch(error => {
      next(error)
    })

})

app.post('/api/phonebook', (request, response,next) => {
    
    const { name, number } = request.body

    if (!name || !number) {
      return response.status(400).json({ error: 'Name and number are required' })
    }
    
    const person = new PhoneBook({ name, number })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
  })

app.put('/api/phonebook/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body

  PhoneBook.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPhonebook => {
      if (updatedPhonebook) {
        response.json(updatedPhonebook)
        return
      }

      response.status(404).send({ error: 'Phonebook entry not found' })
    })
    .catch(error => {
      next(error)
    })
})




const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

