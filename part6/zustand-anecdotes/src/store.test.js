import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/dotes', () => {
  const getAll = vi.fn()
  const createDot = vi.fn()
  const updateDot = vi.fn()
  const deleteDot = vi.fn()

  return {
    getAll,
    createDot,
    updateDot,
    deleteDot,
    default: {
      getAll,
      createDot,
      updateDot,
      deleteDot
    }
  }
})

import noteService from './services/dotes'
import useAnecdoteStore,{ useFilterNotes } from './store'

beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' }) 
  vi.clearAllMocks()
})

describe('useAnecdoteStore', () => {
  it('should initialize with empty anecdotes and filter', () => {
    const { result } = renderHook(() => useAnecdoteStore())

    expect(result.current.anecdotes).toEqual([])
    expect(result.current.filter).toEqual('')
  })

  it('should initialize loads note from service', async () => {
    const mockAnecdotes = [
      { id: 1, content: 'Anecdote 1', votes: 0 },
      { id: 2, content: 'Anecdote 2', votes: 0 }
    ]
    noteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteStore())

    await act(async () => {
      await result.current.actions.initialize()
    })

    expect(result.current.anecdotes).toEqual(mockAnecdotes)
  })

  describe('with existing anecdotes', () => {

    beforeEach(async () => {
        const anecdotes = [
      { id: 1, content: 'Anecdote 1', votes: 5 },
      { id: 2, content: 'Anecdote 2', votes: 10 }
    ]
    noteService.getAll.mockResolvedValue(anecdotes)
    const { result } = renderHook(() => useAnecdoteStore())

    await act(async () => {
      await result.current.actions.initialize()
    })
    })
        
  it('should display anecodotes with votes', async () => {
    const { result } = renderHook(() => useAnecdoteStore())

    expect(result.current.anecdotes[0].votes).toEqual(5)
    expect(result.current.anecdotes[1].votes).toEqual(10)

    })

    it('should update the filter', async () => {
    const { result } = renderHook(() => useAnecdoteStore())

    await act(async () => {
      await result.current.actions.setFilter('test')
    })

    expect(result.current.filter).toEqual('test')
  })

  it('should return the filtered anecdotes', async () => {
    const { result } = renderHook(() => useFilterNotes())

    await act(async () => {
      await useAnecdoteStore.getState().actions.setFilter('1')
    })

    expect(result.current).toEqual([{ id: 1, content: 'Anecdote 1', votes: 5 }])
  })

  it('should increase the vote count of an anecdote', async () => {
    noteService.updateDot.mockResolvedValue({
      id: 1,
      content: 'Anecdote 1',
      votes: 6
    })

    const { result } = renderHook(() => useAnecdoteStore())

    await act(async () => {
      await result.current.actions.vote(1)
    })

    expect(result.current.anecdotes[0].votes).toEqual(6)
  })
})
})