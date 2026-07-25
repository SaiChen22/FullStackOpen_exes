export const Total = (props) => {
  return (
    <p><strong>total of {props.parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</strong></p>
  )
}