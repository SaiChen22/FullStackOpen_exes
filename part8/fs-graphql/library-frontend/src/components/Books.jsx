// src/components/Books.jsx
import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)

  // 1. 获取所有图书，仅用于提取不重复的流派列表生成按钮
  const allBooksResult = useQuery(ALL_BOOKS)

  // 2. 带参数查询：向 GraphQL 服务端请求指定 genre 的图书列表
  const filteredBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: genre === 'all' ? null : genre },
  })

  if (!props.show) {
    return null
  }

  if (allBooksResult.loading || filteredBooksResult.loading) {
    return <div>loading...</div>
  }

  const allBooks = allBooksResult.data?.allBooks || []
  const booksToShow = filteredBooksResult.data?.allBooks || []

  // 提取所有可能的流派供按钮显示
  const genres = Array.from(
    new Set(allBooks.flatMap((b) => b.genres || []))
  )

  return (
    <div>
      <h2>books</h2>

      <p>
        in genre <strong>{genre || 'all'}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      
      <div style={{ marginTop: '10px' }}>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books