document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const getWeatherBtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityNameDisplay = document.getElementById("city-name");
  const temperatureDisplay = document.getElementById("temperature");
  const descriptionDisplay = document.getElementById("description");
  const errorMessage = document.getElementById("error-message");

  const API_KEY = "563657e48d6afe743c86c7b7b447a920"; //env variables

  // Set the default background when the app first loads
  document.body.style.backgroundImage = "url('images/default.jpg')";

  // setDynamicBackground for photos with weather condition
  function setDynamicBackground(condition) {
    const backgroundMap = {
      Clear: "url('images/clear-sky.jpg')",
      Rain: "url('images/rainy.jpg')",
      Snow: "url('images/snowy.jpg')",
      Clouds: "url('images/cloudy.jpeg')",
      Thunderstorm: "url('images/stormy.jpg')",
      Mist: "url('images/mist.jpg')",
      Haze: "url('images/haze.jpg')",
      Drizzle: "url('images/drizzle.jpg')",
    };

    // Set the background image only if the condition is in the map
    const background = backgroundMap[condition] || "url('images/default.jpg')";
    document.body.style.backgroundImage = background;
  }

  getWeatherBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim(); //trim cuts extra space
    if (!city) return;
    // it may throw an error
    //server, database is in another continent

    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherData(weatherData);
    } catch (error) {
      showError();
    }
  });

  async function fetchWeatherData(city) {
    //Just make the web request and gets the data
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);
    console.log(typeof response);
    console.log("RESPONSE", response);

    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    return data;
  }

  function displayWeatherData(data) {
    //Extract data
    const { name, sys, main, weather, timezone } = data;

    //Need to know what type of data are name, main and weather
    //Weather is array type

    // Calculate Fahrenheit from Celsius
    const tempCelsius = main.temp;
    const tempFahrenheit = (tempCelsius * 9) / 5 + 32;

    // Get current date and time (UTC)
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;

    // Convert the local timezone offset (in minutes) to milliseconds by multiplying by 60000 (60 seconds * 1000 milliseconds), ensuring accurate adjustment of local time to UTC.

    const localTime = new Date(utcTime + timezone * 1000);
    const date = localTime.toLocaleDateString(); // Format: MM/DD/YYYY
    const time = localTime.toLocaleTimeString(); // Format: HH:MM:SS AM/PM

    cityNameDisplay.textContent = `${name}, ${sys.country}`; // for country name
    temperatureDisplay.textContent = `Temperature: ${tempCelsius.toFixed(
      1
    )}°C / ${tempFahrenheit.toFixed(1)}°F`;
    descriptionDisplay.textContent = `Weather: ${weather[0].description}`;
    document.getElementById(
      "date-time"
    ).textContent = `Date: ${date}, Time: ${time}`;

    // Set dynamic background based on the weather condition
    setDynamicBackground(weather[0].main);

    //Unlock the display (there is a hidden class @ html)
    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");
  }

  function showError() {
    weatherInfo.classList.add("hidden"); // Hide weather info when there's an error
    errorMessage.classList.remove("hidden"); //show the error message
  }
});
