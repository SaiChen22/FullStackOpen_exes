const AnecdoteList = ({ anecdotes, deleteAnecdote }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id}>{anecdote.content}<button key={anecdote.id} onClick={() => deleteAnecdote(anecdote.id)}> delete</button></li>)}
    </ul>
  </div>
)

export default AnecdoteList
