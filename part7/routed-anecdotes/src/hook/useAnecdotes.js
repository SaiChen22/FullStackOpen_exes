import anecdoteService from '../services/anecdotes'
import { useState, useEffect } from 'react'

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then((data) => setAnecdotes(data))
  }, [])

  const addAnecdote = (anecdote) => {
    anecdoteService.createNew(anecdote).then(() => setAnecdotes(anecdotes.concat({ ...anecdote, id: Math.round(Math.random() * 10000) })))
  }

  const deleteAnecdote = (id) => {
    anecdoteService.deleteOne(id).then(() => setAnecdotes(anecdotes.filter((anecdote) => anecdote.id !== id)))
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}