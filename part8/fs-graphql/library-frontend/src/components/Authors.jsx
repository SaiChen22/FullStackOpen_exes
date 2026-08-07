// src/components/Authors.jsx
import { useQuery } from '@apollo/client/react'
import { ALL_AUTHOR } from '../queries'
import SetBirthdayForm from './SetBirthdayForm'

const Authors = ({ show, token }) => {
  const authors = useQuery(ALL_AUTHOR)

  if (!show) {
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

      {/* 仅在登录状态下显示修改出生年份的表单 */}
      {token && <SetBirthdayForm authors={authors?.data?.allAuthors || []} />}
    </div>
  )
}

export default Authors