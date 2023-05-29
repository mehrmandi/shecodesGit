// city time --------------------------------

let weekArrey = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let cityName = document.querySelector(".city-name");
let cityDate = document.querySelector(".city-date");
let weatherDescription = document.querySelector("#weather-description");
let precipitation = document.querySelector(".city-humidity")
let wind = document.querySelector(".city-wind")
let weatherIcon = document.querySelector(".weather-icon")
let celDeg = document.querySelector(".cel-deg");
let farDeg = document.querySelector(".far-deg");
let searchBtn = document.querySelector(".search-btn");
let flag = true;


function setDate(timestamp) {
  let now = new Date(timestamp);
  let day = weekArrey[now.getDay()];
  let hour = now.getHours();
  let minute = now.getMinutes();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (minute < 10) {
    minute = `0${minute}`;
  }
  cityDate.innerHTML = `${day} ${hour}:${minute}`;
}

// ---------------------------------------------------------------

function changeToFar() {
  if (flag) {
    let cityTemp = document.querySelector(".city-temp");
    let cityTempValue = cityTemp.innerHTML;
    cityTempValue = Math.round((9 / 5) * cityTempValue + 32);
    cityTemp.innerHTML = cityTempValue;
    flag = false;
  }
}

function changeToCel() {
  if (!flag) {
    let cityTemp = document.querySelector(".city-temp");
    let cityTempValue = cityTemp.innerHTML;
    cityTempValue = (5 / 9) * (cityTempValue - 32);
    cityTemp.innerHTML = Math.floor(cityTempValue);
    flag = true;
  }
}

farDeg.addEventListener("click", changeToFar);
celDeg.addEventListener("click", changeToCel);

// city name and temp----------------------------------------

const weatherApiKey = "5a3c046fb8c313e5fcd5a350b4cdb1df";
let currentBtn = document.querySelector(".current-city");

function currentCityWeather(res) {
  let cityTemp = document.querySelector(".city-temp");
  let currentTempLoc = Math.round(res.data.main.temp);
  let city = res.data.name;
  let currentWeatherIcon = res.data.weather[0].icon;
  cityName.innerHTML = city;
  cityTemp.innerHTML = currentTempLoc;
  weatherDescription.innerHTML = res.data.weather[0].description;
  precipitation.innerHTML = `Precipitation: ${res.data.main.humidity}%`;
  wind.innerHTML = `Wind: ${res.data.wind.speed}km/h`;
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${currentWeatherIcon}@2x.png`
  );
  console.log();
  setDate(res.data.dt * 1000);

}

function myCityTemp(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;
  axios.get(apiUrl).then(currentCityWeather);
}

function updateCurrentCity(e) {
  e.preventDefault();
  navigator.geolocation.getCurrentPosition(myCityTemp);
}

function searchCityTemp(event) {
  event.preventDefault();
  let searchInput = document.querySelector(".search-input");
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${weatherApiKey}&units=metric`;
  axios.get(apiUrl).then(currentCityWeather);
}

currentBtn.addEventListener("click", updateCurrentCity);
searchBtn.addEventListener("click", searchCityTemp);
