import React, { useState, useEffect } from "react";
import axios from "axios";
import "./app.css";
import clear from './assets/clear.jpg';
import rain from './assets/rain.jpg';
import cloud2 from './assets/cloud2.jpg';
import cloud from './assets/cloud.jpg';
import always from './assets/default.jpg';
import HourlyWeather from './components/hourlyWeather/hourlyWeather';

function App() {
  const [city, setCity] = useState("");
  const [displayCity, setDisplayCity] = useState("");
  const [data, setData] = useState({});
  const [weather, setWeather] = useState([]);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [holat, setHolat] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const API_KEY = "42d775b5352ffaf7ce3cc6eb3d88907d";

  const getData = () => {
    if (city) {
      axios
        .get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`)
        .then((response) => {
          if (response.data.length > 0) {
            setLat(response.data[0].lat);
            setLon(response.data[0].lon);
            setDisplayCity(city);
          } else {
            console.error("City not found");
          }
        })
        .catch((error) => {
          console.error("Geocoding error:", error);
        });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (lat && lon) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        .then((response) => {
          setWeather(response.data.list);
        })
        .catch((error) => {
          console.error("Weather error:", error);
          setWeather([]);
        });

      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        .then((response) => {
          setData(response.data);
          setHolat(response.data.weather[0].main);
        })
        .catch((error) => {
          console.error("Weather error:", error);
          setData({});
          setHolat("");
        });
    }
  }, [lat, lon]);

  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { day: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  const groupByDay = (data) => {
    return data.reduce((acc, reading) => {
      const date = reading.dt_txt.split(" ")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(reading);
      return acc;
    }, {});
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="container">
      <div className="app" >
      <div className="img">
        {holat === 'Clear' ? (
          <img src={clear} style={{ maxWidth: '100%', }} alt="clear weather" />
        ) : holat === 'Drizzle' ? (
          <img src={cloud} style={{ maxWidth: '100%' }} alt="cloudy weather" />
        ) : holat === 'Rain' ? (
          <img src={rain} style={{ maxWidth: '100%' }} alt="rainy weather" />
        ) : holat === 'Clouds' ? (
          <img src={cloud2} style={{ maxWidth: '100%' }} alt="rainy weather" />
        ) : <img src={always} style={{ maxWidth: '100%' }} alt="rainy weather" />}
      </div>
<div className="header">
  <h1>
    Easly find weather any place 
  </h1>
<input
        type="text"
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={getData}>Get Weather</button>
</div>
      {data.main && (
       <div>
        <h2 style={{textAlign:'center',color:'#fff'}}>
          Current Weather in <span style={{textTransform:'Capitalize'}}>{displayCity}</span>
        </h2>
         <div className="now">
          <p>Temperature: {(data.main.temp - 273.15).toFixed(2)} °C</p>
          <p>Humidity: {data.main.humidity} %</p>
          <p>Pressure: {data.main.pressure} hPa</p>
          <p>Wind Speed: {data.wind.speed} m/s</p>
          
        </div>
       </div>
      )}

      {weather && weather.length > 0 && (
        <div className="scroll">
          <h2 style={{ color: '#fff', textAlign: 'center' }}>5-Day Weather Forecast in <span style={{textTransform:'Capitalize'}}>{displayCity}</span></h2>
          <div className="weather-forecast">
            {Object.entries(groupByDay(weather)).map(([date, readings], index) => (
              <div key={index} className="weather-day" onClick={() => handleDayClick(date)}>
                <h3>{getFormattedDate(date)}</h3>
                <p>{getDayOfWeek(date)}</p>
                <p>
                  {readings[0] && readings[0].main ? (readings[0].main.temp - 273.15).toFixed(2) : 'N/A'} °C /
                  {readings[1] && readings[1].main ? (readings[1].main.temp - 273.15).toFixed(2) : 'N/A'} °C
                </p>
                <p>
                  {readings[0] && readings[0].weather && readings[0].weather.length > 0 && (
                    <img
                      src={`http://openweathermap.org/img/wn/${readings[0].weather[0].icon}.png`}
                      alt="weather icon"
                    />
                  )}
                  {readings[1] && readings[1].weather && readings[1].weather.length > 0 && (
                    <img
                      src={`http://openweathermap.org/img/wn/${readings[1].weather[0].icon}.png`}
                      alt="weather icon"
                    />
                  )}
                </p>
               
              </div>
            ))}
          </div>
          {selectedDate && (
            <div>
              <h3 style={{textAlign:'center',color:'#fff'}}>{getFormattedDate(selectedDate)} - {getDayOfWeek(selectedDate)}</h3>
              <HourlyWeather hourlyData={groupByDay(weather)[selectedDate]} />
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
