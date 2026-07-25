export const Person = ({ persons , handleDelete }) => {
  return (
    <ul>
      {persons.map(person => (
        <li key={person.name}>
          {person.name} - {person.number}
          <button type="button" onClick={() => handleDelete(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}