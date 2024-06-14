import { useState, useEffect } from "react";
import { nanoid } from "nanoid"
import loader from "./assets/loader.svg"
import Browser from "./assets/browser.svg"
import countriesList from "./assets/countries.json"
import "./App.css"

function App() {

  const [weatherData, setWeatherData] = useState(null)
  const [errorInfo, setErrorInfo] = useState(null)
  const [citiesList, setCitiesList] = useState("")
  const [formCity, setFormCity] = useState("")
  const [statesList, setStatesList] = useState(false)
  const [formState, setFormState] = useState("")
  const [formCountry, setFormCountry] = useState("")

  const APIKey = import.meta.env.VITE_WEATHER_API_KEY

  // Fetch local weather on start
  useEffect(() => {
    fetch(`http://api.airvisual.com/v2/nearest_city?key=${APIKey}`)
    .then(response => {
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
  
  // Get custom request
  function newWeatherReq(){
    if(formCity && formState && formCountry){
      fetch(`http://api.airvisual.com/v2/city?city=${formCity}&state=${formState}&country=${formCountry}&key=${APIKey}`)
      .then(response => {  
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

    }
  }

  // Fetch states list
  useEffect(() => {
    if(formCountry != ""){
      fetch(`http://api.airvisual.com/v2/states?country=${formCountry}&key=${APIKey}`)
      .then(response => {
        if(!response.ok) throw new Error(`Error ${response.status}, ${response.statusText}`)
  
        return response.json()
      })
      .then(responseData => {
        setStatesList(responseData.data)
      })
      .catch(err => {
        setErrorInfo(err.message)
      })

    }
    else{
      setStatesList(false)
      setCitiesList(false)
    }
  }, [formCountry])


  // Fetch cities list
  useEffect(() => {
    if(formState != ""){
      fetch(`http://api.airvisual.com/v2/cities?state=${formState}&country=${formCountry}&key=${APIKey}`)
      .then(response => {
        if(!response.ok) throw new Error(`Error ${response.status}, ${response.statusText}`)
  
        return response.json()
      })
      .then(responseData => {
        setCitiesList(responseData.data)
      })
      .catch(err => {
        setErrorInfo(err.message)
      })

    }
    else{
      setCitiesList(false)
    }
  }, [formState])
  

  return <main>
    <div className="card">
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
    </div>

    <div className="form">
      <h3>Weather all over the world</h3>

      {/* Country selection */}
      <select onChange={e => setFormCountry(e.target.value)}>
        <option value="">Select a country*</option>
        {countriesList.map(item => (
          <option key={item.name} value={item.name}>{item.name}</option>
        ))}
      </select>

      {/* State selection */}
      {(statesList || citiesList) && (
        <select onChange={e => setFormState(e.target.value)}>
          <option value="">Select a state*</option>
          {statesList.map(item => (
            <option key={item.state} value={item.state}>{item.state}</option>
          ))}
        </select>
      )}

      {/* City selection */}
      {citiesList && (
        <select onChange={e => setFormCity(e.target.value)}>
          <option value="">Select a city*</option>
          {citiesList.map(item => (
            <option key={item.city} value={item.city}>{item.city}</option>
          ))}
        </select>
      )}

      {(formCountry && formState && formCity) && (
        <button onClick={newWeatherReq}>Send</button>
      )}
    </div>

  </main>;
}

export default App;
