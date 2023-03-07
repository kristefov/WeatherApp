let button = document.getElementById("searchBtn");
let userInput = document.getElementById("userInput");
let citySave = document.querySelector("ul.list-group");
let currentCity = document.getElementById("today");
let cityN = document.createElement("p");
let image = document.createElement("img");
let date = document.createElement("p");
let temp = document.createElement("p");
let wind = document.createElement("p");
let humidity = document.createElement("p");
let searchHistory = JSON.parse(localStorage.getItem("history")) || [];
let forecast = document.getElementById("forecast");
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
      image.setAttribute(
        "src",
        "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
      );
      cityN.textContent = "City: " + data.name;
      date.textContent = "Date: " + timeUTC.toLocaleDateString();
      temp.textContent = "Temperature: " + data.main.temp + " °F";
      wind.textContent = "Wind: " + data.wind.speed + " Mph";
      humidity.textContent = "Humidity: " + data.main.humidity + " %";
      searchHistory.unshift(data.name);
      searchHistory.splice(5);
      displaySearch();
      localStorage.setItem("history", JSON.stringify(searchHistory));
      currentCity.className =
        "bg-success text-dark border border-danger bg-opacity-25";
    });

  currentCity.append(cityN);
  currentCity.append(image);
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
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      forecast.innerHTML = "";
      for (let i = 2; i < data.list.length; i += 8) {
        let dayTimeUTC = new Date(data.list[i].dt * 1000);
        let date5div = document.createElement("div");
        date5div.className =
          "forecast5  bg-success m-1 text-dark text-center p-3 bg-opacity-25";
        let date5 = document.createElement("p");
        date5.textContent = dayTimeUTC.toLocaleDateString();
        let image5 = document.createElement("img");
        image5.setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" +
            data.list[i].weather[0].icon +
            "@2x.png"
        );
        let weather5 = document.createElement("p");
        weather5.textContent = "Temp: " + data.list[i].main.temp + " °F";
        let wind5 = document.createElement("p");
        wind5.textContent = "Wind: " + data.list[i].wind.speed + " Mph";
        let humidity5 = document.createElement("p");
        humidity5.textContent =
          "Humidity: " + data.list[i].main.humidity + " %";

        forecast.append(date5div);
        date5div.append(date5);
        date5div.append(image5);
        date5div.append(weather5);
        date5div.append(wind5);
        date5div.append(humidity5);
      }
    });
}

let displaySearch = function () {
  citySave.innerHTML = "";
  for (let i = 0; i < searchHistory.length; i++) {
    let cityList = document.createElement("li");
    cityList.textContent = searchHistory[i];
    cityList.className =
      "list-group-item m-2 bg-success text-dark text-center bg-opacity-25";
    cityList.addEventListener("click", function () {
      getApi(searchHistory[i]);
      getForecast(searchHistory[i]);
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
