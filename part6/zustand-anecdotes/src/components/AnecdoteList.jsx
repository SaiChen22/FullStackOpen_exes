import { useAnecdoteActions,useFilterNotes} from "../store"

const AnecdoteList = () => {
  const anecdotes = useFilterNotes()
  const { vote, delete: deleteAnecdote } = useAnecdoteActions()

  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)
  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
          </div>
          <button onClick={() => vote(anecdote.id)}>vote</button>
          {anecdote.votes === 0 && <button onClick={() => deleteAnecdote(anecdote.id)}>delete</button>}
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList