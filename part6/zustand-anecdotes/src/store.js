
import { create } from 'zustand'
import {devtools} from 'zustand/middleware'
import { getAll,createDot, updateDot, deleteDot} from './services/dotes'
import { setNotification } from './noti'

const AsObject = (anecdote) => ({
  content: anecdote,
  id: (100000 * Math.random()).toFixed(0),
  votes: 0
})

const useAnecdoteStore = create(devtools((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    addAnecdote: async (anecdote) => {
      const newAnecdote = await createDot(AsObject(anecdote))
      set((state) => ({ anecdotes: [...state.anecdotes, newAnecdote] }))
      setNotification(`you created '${newAnecdote.content}'`, 5)
    },
    initialize: async() => {
      const anecdotes = await getAll()
      set(() => ({anecdotes}))
    },
    vote: async (id) => {
     const updatedDot = await updateDot(id, { ...get().anecdotes.find((a) => a.id === id), votes: get().anecdotes.find((a) => a.id === id).votes + 1 })
     set((state) => ({ anecdotes: state.anecdotes.map((a) => a.id === id ? updatedDot : a) }))
     setNotification(`you voted '${updatedDot.content}'`, 5)
    },
    delete: async (id) => {
      await deleteDot(id)
      set((state) => ({ anecdotes: state.anecdotes.filter((a) => a.id !== id) }))
      setNotification(`you deleted an anecdote`, 5)
    },
    setFilter: (filter) => set(() => ({
      filter
    })),

  },
})))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export const useFilterNotes = () => {
  const filter = useAnecdoteStore((state) => state.filter)
  const anecdotes = useAnecdotes()
  if (!filter) {
    return anecdotes
  }
  return anecdotes.filter((anecdote) => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
}
export default useAnecdoteStore
