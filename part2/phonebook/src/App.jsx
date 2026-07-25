import { useEffect, useState } from 'react'
import { Filter } from './components/Filter'
import { PersonForm } from './components/PersonForm'
import { Person } from './components/Person'
import { Notification } from './components/Notification'
import nodeService from './services/node'

const App = () => {

  useEffect(() => {
    console.log('effect')
    nodeService.getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response)
      })
  }, [])

  const [persons, setPersons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (!notification) {
      return
    }

    const timer = setTimeout(() => {
      setNotification(null)
    }, 5000)

    return () => clearTimeout(timer)
  }, [notification])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
  }

  const handleChange = (event) => {
    setNewName(event.target.value)
  }

  const handleChangeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)
    const personToAdd = { name: newName, number: newNumber }

    if (existingPerson) {
      const replaceNumber = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      )

      if (!replaceNumber) {
        return
      }

      nodeService.update(existingPerson.id, personToAdd)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
          showNotification(`Updated ${returnedPerson.name}`)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          if (error.response?.status === 404) {
            setPersons(persons.filter(person => person.id !== existingPerson.id))
            showNotification(
              `Information of ${personToAdd.name} has already been removed from server`,
              'error'
            )
          }
        })

      return
    }

    nodeService.create(personToAdd)
      .then(response => {
        setPersons([...persons, response])
        showNotification(`Added ${response.name}`)
        setNewName('')
        setNewNumber('')
      })
  }
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      nodeService.remove(id)
        .then(response => {
          console.log('promise fulfilled')
          setPersons(persons.filter(person => person.id !== id))
          showNotification('Deleted person')
        })
    }
  }
  const filteredPersons = searchTerm
    ? persons.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter searchTerm={searchTerm} handleSearch={handleSearch} />

      <h3>Add a new person</h3>
      
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleChange={handleChange}
        handleChangeNumber={handleChangeNumber}
        handleSubmit={handleSubmit}
      />
      <h3>Numbers</h3>
      
      <Person persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App