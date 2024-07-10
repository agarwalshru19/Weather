import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear_01d.png";
import clear_icon2 from "../assets/clear_01n.png";
import few_icon from "../assets/few_02d.png";
import few_icon2 from "../assets/few_02n.png";
import scattered_icon from "../assets/scattered_03.png";
import drizzle_icon from "../assets/drizzle_09.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain_10d.png";
import rain_icon2 from "../assets/10n.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import broken_icon from "../assets/broken_04.png";
import mist_icon from "../assets/50d.png";
import thunder_icon from "../assets/11d.png";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon2,
    "02d": few_icon,
    "02n": few_icon2,
    "03d": scattered_icon,
    "03n": scattered_icon,
    "04d": broken_icon,
    "04n": broken_icon,
    "09d": drizzle_icon,
    "09n": drizzle_icon,
    "10d": rain_icon,
    "10n": rain_icon2,
    "11d": thunder_icon,
    "11n": thunder_icon,
    "13d": snow_icon,
    "13n": snow_icon,
    "50d": mist_icon,
    "50n": mist_icon,
  };
  const search = async (city) => {
    if (city === "") {
      alert("Enter city name");
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      const icon = allIcons[data.weather[0].icon] || clear_icon;

      if (response.ok) {
        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          icon: icon,
          description: data.weather[0].description,
        });
        inputRef.current.value = "";
      } else {
        alert(data.message);
        setWeatherData(false);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Failed to fetch weather data. Please try again later.");
      setWeatherData(false);
    }
  };
  useEffect(() => {
    search("Kolkata");
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search(inputRef.current.value);
            }
          }}
        />
        <img
          src={search_icon}
          alt="search icon"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="weather-icon" height="150px" />
          <p className="desc">{weatherData.description}</p>
          <p className="temperature">{weatherData.temperature} °C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
            <div className="date-time">
              <p>
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>{currentTime.toLocaleDateString()}</p>
            </div>
          </div>
        </>
      ) : (
        <p>No weather data available</p>
      )}
    </div>
  );
};

export default Weather;
