// variables for use in the first day function forecast and the search city option
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
// function for fecth the data for the current forecast.
function getApi(cityName) {
  let requestWeather =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    keyWeather +
    "&units=metric";
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
      cityN.textContent = data.name;
      date.textContent = "Date: " + timeUTC.toLocaleDateString();
      temp.textContent = "Temperature: " + data.main.temp + " °C";
      wind.textContent = "Wind: " + data.wind.speed + " Mph";
      humidity.textContent = "Humidity: " + data.main.humidity + " %";
      if (!searchHistory.includes(data.name)) {
        searchHistory.push(data.name);
      }
      if (searchHistory.length > 5) {
        searchHistory.shift();
      }
      //searchHistory.splice(4);
      displaySearch();
      // save the city cearh in th elocal storage
      localStorage.setItem("history", JSON.stringify(searchHistory));
      currentCity.className =
        "bg-success m-1 p-4 rounded-4 text-dark bg-opacity-25";
      cityN.className =
        "rounded-4 m-2 p-2 text-shadow text-center shadow text-white bg-success";
    });
  // appending the variables for the current weather section
  currentCity.append(cityN);
  currentCity.append(image);
  currentCity.append(date);
  currentCity.append(temp);
  currentCity.append(wind);
  currentCity.append(humidity);
}
// function to fecth the data for the 5-day forecast section
function getForecast(cityName) {
  let requestForecast =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=" +
    keyWeather +
    "&units=metric";
  fetch(requestForecast)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // creatting for loop to create elemets and append them for each next 5 days
      forecast.innerHTML = "";
      for (let i = 6; i < data.list.length; i += 8) {
        let dayTimeUTC = new Date(data.list[i].dt * 1000);
        let date5div = document.createElement("div");
        date5div.className =
          "forecast5  bg-success m-1 text-dark rounded-4 text-center p-3 bg-opacity-25";
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
        weather5.textContent = "Temp: " + data.list[i].main.temp + " °C";
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
// function to save the city searched in the unorder list
let displaySearch = function () {
  citySave.innerHTML = "";
  for (let i = 0; i < searchHistory.length; i++) {
    let cityList = document.createElement("li");
    cityList.textContent = searchHistory[i];
    cityList.className =
      "list-group-item m-2 bg-success rounded-4 text-dark text-center bg-opacity-25";
    cityList.addEventListener("click", function () {
      getApi(searchHistory[i]);
      getForecast(searchHistory[i]);
 // it will move most recent searh of list element to the top
      let arr = [];
      let historyObject = searchHistory[i];
      searchHistory.splice(i, 1);
      arr = [historyObject, ...searchHistory];
      console.log(arr);
      searchHistory = arr;
    });
    citySave.append(cityList);
  }
};
// event listener for the city search button
button.addEventListener("click", function (event) {
  event.preventDefault();
  let city = userInput.value;

  getApi(city);
  getForecast(city);
});
displaySearch();
