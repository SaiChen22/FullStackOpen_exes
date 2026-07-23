import { useState } from 'react'
import Button from './components/Button'

const Statisticline = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = total > 0 ? (good + neutral + bad) / 3 : 0
  const positive = total > 0 ? (good / total) * 100 : 0

  return (
    <table>
      <tbody>
        <Statisticline text="good" value={good} />
        <Statisticline text="neutral" value={neutral} />
        <Statisticline text="bad" value={bad} />
        <Statisticline text="total" value={total} />
        <Statisticline text="average" value={average} />
        <Statisticline text="positive" value={positive} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1> give feedback </h1>
      <Button text='good' onClick={() => setGood(good + 1)} />
      <Button text='neutral' onClick={() => setNeutral(neutral + 1)} />
      <Button text='bad' onClick={() => setBad(bad + 1)} />

      <h2> statistics </h2>
      {good + neutral + bad > 0 ? (
        <Statistics good={good} neutral={neutral} bad={bad} />
      ) : (
        <p>No feedback given.</p>
      )}
    </div>
  )
}

export default App