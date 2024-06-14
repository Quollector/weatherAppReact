import { useState, useEffect } from "react";
import loader from "./assets/loader.svg"
import Browser from "./assets/browser.svg"
import "./App.css"

function App() {

  const [weatherData, setWeatherData] = useState(null)
  const [errorInfo, setErrorInfo] = useState(null)

  const APIKey = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    fetch(`http://api.airvisual.com/v2/nearest_city?key=${APIKey}`)
    .then(response => {
      console.log(response);

      // Non pris en compte par catch
      // 400 - 499 : Erreur client
      // 500 - 599 : Erreur serveur
      if(!response.ok) throw new Error(`Error ${response.status}, ${response.statusText}`)

      return response.json()
    })
    .then(responseData => {
      setWeatherData({
        city: responseData.data.city,
        country: responseData.data.country,
        iconId: responseData.data.current.weather.ic,
        temp: responseData.data.current.weather.tp
      })
    })
    .catch(err => {
      setErrorInfo(err.message)
    })
  }, [])
  

  return <main>
    <div className={`loader-container ${(!weatherData && !errorInfo) && "active"}`}>
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

    {(errorInfo && !weatherData) && (
      <>
        <p className="error-information">{errorInfo}</p>
        <img src={Browser} alt="error icon" />
      </>
    )}
  </main>;
}

export default App;
