import { useQuery } from '@apollo/client/react'
import { ALL_AUTHOR } from '../queries'

import SetBirthdayForm from './SetBirthdayForm'


const Authors = (props) => {
  const authors =useQuery(ALL_AUTHOR)


  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors?.data?.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SetBirthdayForm authors={ authors?.data?.allAuthors||[]}/>
    </div>
  )
}

export default Authors
