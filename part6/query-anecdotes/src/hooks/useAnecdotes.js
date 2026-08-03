import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from '../request'

const useAnecdotes = () => {
  const queryClient = useQueryClient()

  const anecdotesQuery = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: ({ id, updatedAnecdote }) => updateAnecdote(id, updatedAnecdote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const handleVote = (anecdoteId) => {
    const anecdotes = anecdotesQuery.data || []
    const anecdoteToUpdate = anecdotes.find((a) => a.id === anecdoteId)

    if (!anecdoteToUpdate) {
      return
    }

    updateAnecdoteMutation.mutate({
      id: anecdoteId,
      updatedAnecdote: { ...anecdoteToUpdate, votes: anecdoteToUpdate.votes + 1 },
    })
  }

  return {
    anecdotes: anecdotesQuery.data || [],
    isPending: anecdotesQuery.isPending,
    isError: anecdotesQuery.isError,
    error: anecdotesQuery.error,
    handleVote,
  }
}

export default useAnecdotes
