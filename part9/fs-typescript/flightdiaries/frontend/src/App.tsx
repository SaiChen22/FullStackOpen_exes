import { useEffect, useState } from "react"
import type{NewDiary,Diary} from './types.ts'
import { WeatherOptions, VisibilityOptions } from './types.ts'

function App() {

  const DiariesTitle = "Flight Diaries"
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [newDiary, setNewDiary] = useState<NewDiary>({
    date: '',
    weather: 'sunny',
    visibility: 'great',
  });
  
  useEffect(() => {
    const fetchDiaries = async () => {
      const response = await fetch('/api/diaries');
      const data: Diary[] = await response.json();
      setDiaries(data);
    };

    fetchDiaries();
  }, []);


  /*POST http://localhost:3000/api/diaries
Content-Type: application/json

{
  "date": "2023-01-01",
  "weather": "sunny",
  "visibility": "good"
} */
  const handleAddNewDiarySummit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addNewDiary = async () => {
      const response = await fetch('/api/diaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDiary),
      });

      if (!response.ok) {
        return;
      }

      const data: Diary = await response.json();
      setDiaries(prev => [...prev, data]);
      setNewDiary({
        date: '',
        weather: 'sunny',
        visibility: 'great',
      });
    };

    addNewDiary();
  };

  return (
    <div>
      <h1>{DiariesTitle}</h1>
      <form onSubmit={handleAddNewDiarySummit}>
        <label htmlFor="date">Date:</label>
        <input key="date" type="date" id="date" value={newDiary.date} onChange={(e) => setNewDiary({...newDiary, date: e.target.value})} />
        <label htmlFor="weather">Weather:</label>
        <select key="weather" id="weather" value={newDiary.weather} onChange={(e) => setNewDiary({...newDiary, weather: e.target.value})}>
          {WeatherOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <label htmlFor="visibility">Visibility:</label>
        <select key="visibility" id="visibility" value={newDiary.visibility} onChange={(e) => setNewDiary({...newDiary, visibility: e.target.value})}>
          {VisibilityOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button type="submit">Add Diary</button>
      </form>
      {diaries.map(diary => (
        <div key={diary.id}>
          <p>Date: {diary.date}</p>
          <p>Weather: {diary.weather}</p>
          <p>Visibility: {diary.visibility}</p>
        </div>
      ))}
    </div>
  )
}

export default App
