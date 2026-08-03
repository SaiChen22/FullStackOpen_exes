import {useIncrement} from '../store'

const Buttons = () => {
  const increment = useIncrement()
  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={() => increment('good')}>good</button>
      <button onClick={() => increment('neutral')}>neutral</button>
      <button onClick={() => increment('bad')}>bad</button>
    </div>
  )
}

export default Buttons
