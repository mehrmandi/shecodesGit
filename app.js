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
let precipitation = document.querySelector(".city-humidity");
let wind = document.querySelector(".city-wind");
let weatherIcon = document.querySelector(".weather-icon");
let searchBtn = document.querySelector(".search-btn");
let dailyForcast = document.querySelector(".daily-forcast-container");
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
  setDate(res.data.dt * 1000);

  getForcast(res.data.coord);
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

function getForcast(coordinate) {
  let shecodesKey = "6d68aadfacdd4f5163bc273049a0cf2d";
  const oncallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinate.lat}&lon=${coordinate.lon}&appid=${shecodesKey}&units=metric`;

  axios.get(oncallAPI).then(forcastGenerate);
}

function forcastGenerate(res) {
  let forcastDaysArray = res.data.daily;

  console.log(forcastDaysArray);

  dailyForcast.innerHTML = "";

  forcastDaysArray.forEach(function (day, index) {
    if (index < 5) {
      dailyForcast.insertAdjacentHTML(
        "beforeend",
        `
    <div class="col d-flex flex-column align-items-center">
            <p class="my-0">${formatDate(day.dt)}</p>
            <img class="weather-forecast-icon"
              src="https://openweathermap.org/img/wn/${
                day.weather[0].icon
              }@2x.png"
              alt="weather-forcast"
            />
            <div>
              <span class="weather-temp-min"> ${Math.round(
                day.temp.min
              )}°-</span>
              <span class="weather-temp-max"> ${Math.round(
                day.temp.max
              )}°</span>
            </div>
          </div>
    `
      );
    }
  });
}

function formatDate(timestamp) {
  let now = new Date(timestamp * 1000);
  let day = now.getDay();
  return weekArrey[day];
}

window.addEventListener("load", updateCurrentCity);
currentBtn.addEventListener("click", updateCurrentCity);
searchBtn.addEventListener("click", searchCityTemp);
