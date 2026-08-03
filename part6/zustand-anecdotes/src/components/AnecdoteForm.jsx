import { useAnecdoteActions } from "../store"


const AnecdoteForm = () => {
    
  const {addAnecdote} = useAnecdoteActions()
  const submitHandler = (e) => {
    e.preventDefault()
    const content = e.target.content.value
    if (content) {
      addAnecdote(content)
      e.target.reset()
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <div>
        <input name="content" />
      </div>
      <button>create</button>
    </form>
  )
}

export default AnecdoteForm