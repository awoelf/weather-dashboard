// API weather calls
async function getWeather(cityName) {
  const API_KEY = `adb34fa4c27943beb2b3ebc75e92ec06`;
  const COORDS_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`;
  fetch(COORDS_URL, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then((data) => {
      let lat = data[0].lat;
      let lon = data[0].lon;
      const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
      fetch(WEATHER_URL, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw response.json();
          }
          return response.json();
        })
        .then((data) => {
          currentWeather(data);
        });
      const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
      fetch(FORECAST_URL, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw response.json();
          }
          return response.json();
        })
        .then((data) => {
          createForecast(data);
        });
    })
    .catch((error) => console.log("error", error));
}

// Displays the current weather of the searched city
let currentWeather = (data) => {
  $("#current-title").text("Current Weather");
  $("#city-name").text(`${data.name}`);
  $("#weather-icon").attr(
    "src",
    `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  $("#current-date").text(`${moment().format("M/D/YYYY")}`);
  $(".weather-details").children().addClass("d-flex align-items-center h4");
  $("#current-temp")
    .empty()
    .append(
      $("<span>").addClass("material-symbols-outlined mr-2").text("thermometer")
    )
    .append(`${data.main.temp}°F`);
  $("#current-wind")
    .empty()
    .append($("<span>").addClass("material-symbols-outlined mr-2").text("air"))
    .append(`${data.wind.speed} mph`);
  $("#current-humid")
    .empty()
    .append(
      $("<span>").addClass("material-symbols-outlined mr-2").text("water_drop")
    )
    .append(`${data.main.humidity}%`);
};

// Creates 5 forecast cards
let createForecast = (data) => {
  $("#forecast-title").text("5-Day Forecast");
  $("#forecast").empty();
  for (let i = 5, j = 1; i < 38; i += 8, j++) {
    $("#forecast").append(
      $("<div>")
        .addClass("col-sm-12 col-md forecast-card mx-2 rounded py-2")
        .append(
          $("<div>")
            .addClass(
              "row d-flex align-items-center justify-content-center border-bottom mb-3"
            )
            .append(
              $("<h4>")
                .addClass("forecast-date m-0")
                .text(`${moment().add(j, "days").format("M/D/YYYY")}`)
            )
            .append(
              $("<img>").attr(
                "src",
                `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`
              )
            )
        )
        .append(
          $("<p>")
            .addClass("forecast-detail")
            .append(
              $("<span>")
                .addClass("material-symbols-outlined mr-2")
                .text("thermometer")
            )
            .append(`${data.list[i].main.temp}°F`)
        )
        .append(
          $("<p>")
            .addClass("forecast-detail")
            .append(
              $("<span>").addClass("material-symbols-outlined mr-2").text("air")
            )
            .append(`${data.list[i].wind.speed} mph`)
        )
        .append(
          $("<p>")
            .addClass("forecast-detail")
            .append(
              $("<span>")
                .addClass("material-symbols-outlined mr-2")
                .text("water_drop")
            )
            .append(`${data.list[i].main.humidity}%`)
        )
    );
  }
  $(".forecast-detail").addClass("d-flex align-items-center ml-1");
};

let addHistory = (cityName) => {
  $("#city-history")
    .children()
    .remove(`#${cityName.replace(/\s/g, "").toLowerCase()}`);
  if ($("#city-history").children(".history-btn").length === 10) {
    $("#city-history").children().remove(":last");
  }
  $("#city-history").prepend(
    $("<button>")
      .attr("id", `${cityName.replace(/\s/g, "").toLowerCase()}`)
      .addClass("btn btn-lg history-btn col-md-12 col-sm-2")
      .text(`${cityName}`)
  );
};

// getWeather("Austin");

$("#search-btn").on("click", function (event) {
  event.preventDefault();
  getWeather(`${$("#search-bar").val()}`);
  addHistory(`${$("#search-bar").val()}`);
});

$(document).on("click", ".history-btn", function (event) {
  event.preventDefault();
  console.log(`${this.id}`);
  getWeather(`${this.id}`);
});
getWeather("Busan");
