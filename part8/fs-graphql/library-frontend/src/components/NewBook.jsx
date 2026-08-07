// src/components/NewBook.jsx

import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHOR } from '../queries'

const NewBook = (props) => {
  const [addBook] = useMutation(ADD_BOOK, {
    // 当添加新书成功后，重新获取 ALL_BOOKS 与 ALL_AUTHOR 数据的 Query 缓存
    refetchQueries: [
      { query: ALL_BOOKS },
      { query: ALL_BOOKS, variables: { genre: null } },
      { query: ALL_AUTHOR }
    ],
    onError: (error) => {
      console.error(error)
    }
  })

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    await addBook({
      variables: {
        title,
        author,
        published: parseInt(published),
        genres
      }
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <label>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
        <label>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
        <label>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </label>
        <label>
          genre
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </label>
        <label>
          genres: {genres.join(' ')}
        </label>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook