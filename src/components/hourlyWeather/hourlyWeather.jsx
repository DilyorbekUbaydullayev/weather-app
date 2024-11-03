import React from 'react';
import stl from './hourlyWeather.module.css'
const HourlyWeather = ({ hourlyData }) => {
  return (
    <div className={stl.hourlyweather}>
      {hourlyData.map((reading, index) => (
        <div key={index} className={stl.hourly}>
          <p>{new Date(reading.dt_txt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit',hour12:false })}</p>
          <p>{(reading.main.temp - 273.15).toFixed(2)} °C</p>
          <img src={`http://openweathermap.org/img/wn/${reading.weather[0].icon}.png`} alt="weather icon" />
        </div>
      ))}
    </div>
  );
};

export default HourlyWeather;
