import { Part } from './Part'

export const Content = (props) => {
  return (
    <div>
      {props.parts.map((part) => <Part key={part.name} name={part.name} exercises={part.exercises} />)}
    </div>
  )
}