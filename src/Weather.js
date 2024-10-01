import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

export default function Weather() {
  const [city, setCity] = useState("Paris"); // Default city
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;

      setLoading(true);

      try {
        const apiKey = `8ca7dd4e61360b90fb66918853670e48`; // Replace with your actual API key
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const weatherResponse = await axios.get(weatherUrl);
        const forecastResponse = await axios.get(forecastUrl);

        const currentWeather = weatherResponse.data;
        const roundedTemperature = Math.round(currentWeather.main.temp);
        const timezoneOffset = currentWeather.timezone;

        const forecastList = forecastResponse.data.list
          .filter((item) =>
            moment(item.dt * 1000).isSameOrAfter(new Date(), "day")
          )
          .slice(0, 5) // Get 5 days of forecast
          .map((item) => ({
            date: moment(item.dt * 1000).format("ddd"), // Short day format
            icon: item.weather[0].icon,
            tempMin: Math.round(item.main.temp_min),
            tempMax: Math.round(item.main.temp_max),
          }));

        // Ensure forecast days start from tomorrow
        const rotatedForecast = rotateForecastFromTomorrow(forecastList);

        setWeatherData({
          city: currentWeather.name,
          temperature: roundedTemperature,
          description: currentWeather.weather[0].description,
          humidity: currentWeather.main.humidity,
          wind: currentWeather.wind.speed,
          icon: currentWeather.weather[0].icon,
          timezoneOffset,
          forecast: rotatedForecast,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  // Function to rotate forecast to start from tomorrow
  const rotateForecastFromTomorrow = (forecast) => {
    const todayIndex = moment().day(); // Get the index of the current day (0=Sunday, 1=Monday, ..., 6=Saturday)

    // Create an array of days starting from tomorrow
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const orderedWeekDays = [
      ...weekDays.slice(todayIndex + 1), // Start from tomorrow
      ...weekDays.slice(0, todayIndex + 1), // Wrap around the remaining days
    ];

    // Map the forecast days to the ordered week starting from tomorrow
    return forecast.slice(0, 5).map((item, index) => ({
      ...item,
      date: orderedWeekDays[index % 7], // Cycle through the week starting from tomorrow
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputCity = e.target.elements.city.value;
    setCity(inputCity);
    e.target.reset();
  };

  if (loading) return <h4>Loading...</h4>;
  if (error) return <h4>{error}</h4>;

  return (
    <div>
      <h3>React Weather App</h3>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-9">
            <input
              type="text"
              id="city"
              placeholder="Enter a city..."
              required
            />
          </div>
          <div className="col-3">
            <button type="submit">Search</button>
          </div>
        </div>
      </form>

      {weatherData && (
        <div className="WeatherInfo">
          <div className="row">
            <div className="col-6">
              <h1>{weatherData.city}</h1>
              <ul className="city-info">
                <li>
                  <span>
                    {moment()
                      .utcOffset(weatherData.timezoneOffset / 60)
                      .format("dddd HH:mm")}
                  </span>
                  , {weatherData.description}
                </li>
                <li>
                  Humidity:{" "}
                  <strong className="humidity">{weatherData.humidity}%</strong>,
                  Wind: <strong className="wind">{weatherData.wind} m/s</strong>
                </li>
              </ul>
            </div>

            <div className="col-6">
              <div className="temperature-container d-flex justify-content-end">
                <span className="icon">
                  <img
                    src={`http://openweathermap.org/img/wn/${weatherData.icon}.png`}
                    alt={weatherData.description}
                    className="main-icon"
                  />
                </span>
                <span className="temperature">{weatherData.temperature}</span>
                <span className="unit">°C</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="WeatherForecast row">
        {weatherData &&
          weatherData.forecast.map((day, index) => (
            <div className="col" key={index}>
              <div className="WeatherForecastPreview">
                <div className="forecast-time">{day.date}</div>
                <img
                  src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                />
                <div className="forecast-temperature">
                  <span className="forecast-temperature-max">
                    {day.tempMax}°
                  </span>
                  <span className="forecast-temperature-min">
                    {day.tempMin}°
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
