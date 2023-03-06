let button = document.getElementById("searchBtn");
let userInput = document.getElementById("userInput");
let citySave = document.querySelector("ul.list-group");
let currentCity = document.getElementById("today");
let cityN = document.createElement("p");
let date = document.createElement("p");
let temp = document.createElement("p");
let wind = document.createElement("p");
let humidity = document.createElement("p");
let searchHistory = JSON.parse(localStorage.getItem("history")) || [];
let keyWeather = "6db007ce7682101c6b918e762e7745b2";

function getApi(cityName) {
  let requestWeather =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    keyWeather;
  fetch(requestWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let timeUTC = new Date(data.dt * 1000);
      cityN.textContent = "City: " + data.name;
      date.textContent = "Date: " + timeUTC.toLocaleDateString();
      temp.textContent = "Temperature: " + data.main.temp;
      wind.textContent = "Wind: " + data.wind.speed;
      humidity.textContent = "Humidity: " + data.main.humidity;
      searchHistory.unshift(data.name);
      searchHistory.splice(5);
      displaySearch();
      localStorage.setItem("history", JSON.stringify(searchHistory));
    });
  currentCity.append(cityN);
  currentCity.append(date);
  currentCity.append(temp);
  currentCity.append(wind);
  currentCity.append(humidity);
}

function getForecast(cityName) {
  let requestForecast =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=" +
    keyWeather;
  fetch(requestForecast)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let days = [0, 8, 16, 24, 32];
    });
}

let displaySearch = function () {
  citySave.innerHTML = "";
  for (let i = 0; i < searchHistory.length; i++) {
    let cityList = document.createElement("li");
    cityList.textContent = searchHistory[i];
    cityList.className =
      "list-group-item m-2 bg-success p-2 text-dark text-center bg-opacity-25";
    cityList.addEventListener("click", function () {
      getApi(searchHistory[i]);
    });
    citySave.append(cityList);
  }
};

button.addEventListener("click", function (event) {
  event.preventDefault();
  let city = userInput.value;

  getApi(city);
  getForecast(city);
});
displaySearch();
