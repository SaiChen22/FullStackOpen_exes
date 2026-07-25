import { useEffect, useState } from 'react'


function App() {
  const [country, setCountry] = useState('')
  const [countries, setCountries] = useState([])
  const [countryData, setCountryData] = useState(null)
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState('')

  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => response.json())
      .then(data => setCountries(data))
  }, [])

const filteredCountries = countries.filter(c => c.name.common.toLowerCase().includes(country.toLowerCase()))



useEffect(() => {
  if (filteredCountries.length !== 1) {
    setCountryData(null)
  }
}, [country])

useEffect(() => {
  const capital = countryData?.capital?.[0]

  if (!capital) {
    setWeather(null)
    setWeatherError('')
    setWeatherLoading(false)
    return
  }

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (!apiKey) {
    setWeather(null)
    setWeatherError('Weather data is not configured. Set VITE_OPENWEATHER_API_KEY to enable it.')
    setWeatherLoading(false)
    return
  }

  const controller = new AbortController()

  setWeather(null)
  setWeatherError('')
  setWeatherLoading(true)

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(capital)}&appid=${apiKey}&units=metric`, {
    signal: controller.signal,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Weather lookup failed')
      }

      return response.json()
    })
    .then(data => {
      setWeather(data)
      setWeatherError('')
    })
    .catch(error => {
      if (error.name === 'AbortError') {
        return
      }

      setWeather(null)
      setWeatherError('Could not load weather data.')
    })
    .finally(() => {
      setWeatherLoading(false)
    })

  return () => controller.abort()
}, [countryData])

const handleCountryClick = (e) => {
  fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/${e.target.value}`)
    .then(response => response.json())
    .then(data => {
      // set the country data and log it
      setCountryData(data)
      console.log(data)
    })
    .catch(err => console.error('Error fetching country data:', err))
}

  const handleSearch = (e) => {
    setCountry(e.target.value)
  }

  return (
    <div>
      <div>find countries:</div>
      <input
        type="text"
        value={country}
        onChange= {handleSearch}
      />

      { country.trim() === ''|| countryData ? (null): 
      filteredCountries.length === 0 ?(<p>No countries found</p>) : 
      filteredCountries.length > 10 ? (<p>Too many matches, please be more specific</p>) : 
      filteredCountries.map(country => (
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={(e) => handleCountryClick(e)} value={country.name.common}>
          Show Details
        </button>
        </li>
        
      ))}

      {countryData && (
        <div>
          <h2>{countryData.name.common}</h2>
          <h1>Capital: {countryData.capital?.[0]}</h1>
          <p>Population: {countryData.population}</p>
          <h2> Languages:</h2>
          <ul>
            {Object.values(countryData.languages).map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
          <img src={countryData.flags.png} alt={`Flag of ${countryData.name.common}`} />
          <h2>Weather in {countryData.capital?.[0]}</h2>
          {weatherLoading && <p>Loading weather...</p>}
          {weatherError && <p>{weatherError}</p>}
          {weather && (
            <div>
              <p>Temperature: {weather.main?.temp} °C</p>
              <p>Wind: {weather.wind?.speed} m/s</p>
              <p>Condition: {weather.weather?.[0]?.description}</p>
              {weather.weather?.[0]?.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
              )}
            </div>
          )}
        </div>
      )}

       </div>
  )
}

export default App
