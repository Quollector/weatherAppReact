import { useState, useEffect } from "react";
import loader from "./assets/loader.svg"
import "./App.css"

function App() {

  const [weatherData, setWeatherData] = useState(null)
  const APIKey = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    fetch(`http://api.airvisual.com/v2/nearest_city?key=${APIKey}`)
    .then(response => {
      console.log(response);
      return response.json()
    })
    .then(responseData => {
      console.log(responseData);
      setWeatherData({
        city: responseData.data.city,
        country: responseData.data.country,
        iconId: responseData.data.current.weather.ic,
        temp: responseData.data.current.weather.tp
      })
    })
  }, [])
  

  return <main>
    <div className={`loader-container ${!weatherData && "active"}`}>
      <img src={loader} alt="loading icon" />
    </div>

    {weatherData && (
      <>
        <p className="city-name">{weatherData.city}</p>
        <p className="country-name">{weatherData.country}</p>
        <p className="temperature">{weatherData.temp}°</p>
        <div className="info-icon-container">
          <img src={`/icons/${weatherData.iconId}.svg`} alt="weather icon" className="info-icon" />
        </div>
      </>
    )}
  </main>;
}

export default App;
