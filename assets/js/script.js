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
          console.log(data.list);
          createForecast(data);
        });
    })
    .catch((error) => console.log("error", error));
}

let currentWeather = (data) => {
  console.log(data);
  $("#city-name").text(`${data.name}`);
  $("#weather-icon").attr(
    "src",
    `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  $("#current-temp").append(`${data.main.temp}°`);
  $("#current-wind").append(`${data.wind.speed} mph`);
  $("#current-humid").append(`${data.main.humidity}%`);
};

let createForecast = (data) => {
  for (let i = 5; i < 38; i += 8) {
    $("#forecast").append(
      $("<div>")
        .addClass("col bg-primary mx-1")
        .append($("<h4>").addClass("forecast-date").text(`${moment().add(i + 1, "days").format("M/D/YYYY")}`))
        .append($("<img>").addClass("forecast-img").attr("src", `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`))
        .append($("<p>").addClass("forecast-temp").text(""))
        .append($("<p>").addClass("forecast-wind"))
        .append($("<p>").addClass("forecast-humid"))
    );

    // $("<div>")
    //   .attr("id", `day-${i}`)
    //   .addClass("col bg-primary mx-1")
    //   .append($("<h4>").addClass("forecast-date").text(moment().add(i + 1, "days").format("M/D/YYYY")))
    //   .append($("<img>").addClass("forecast-img"))

  }
};

getWeather("Austin");
