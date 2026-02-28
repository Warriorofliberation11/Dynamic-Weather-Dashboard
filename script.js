const apiKey = "02764dc904fd2fd3cae6f18b34dac888";  
const weatherCard = document.getElementById("weather");
const forecastContainer = document.getElementById("forecast");
const errorMessage = document.getElementById("error");

function getWeatherByCity() {
    const city = document.getElementById("cityInput").value;
    if (!city) return showError("Please enter a city name.");
    fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
}

function getWeatherByLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
    }, () => showError("Location access denied. Please search by city."));
}

function fetchWeatherData(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.cod === "404") return showError("City not found.");
            renderWeather(data);
            fetchForecast(data.coord.lat, data.coord.lon);
        })
        .catch(() => showError("Network error. Try again later."));
}

function renderWeather(data) {
    weatherCard.classList.remove("hidden");
    document.getElementById("cityName").innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").innerText = `Wind: ${data.wind.speed} m/s`;
    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    errorMessage.innerText = "";
}

function fetchForecast(lat, lon) {
    forecastContainer.innerHTML = "";
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => renderForecast(data.list));
}

function renderForecast(list) {
    const daily = list.filter(item => item.dt_txt.includes("00:00:00"));
    daily.forEach(day => {
        forecastContainer.innerHTML += `
        <div class="forecast-item">
            <h4>${day.dt_txt.split(" ")[0]}</h4>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
            <p>${Math.round(day.main.temp)}°C</p>
            <p>${day.weather[0].main}</p>
        </div>`;
    });
}

function showError(message) {
    errorMessage.innerText = message;
    weatherCard.classList.add("hidden");
    forecastContainer.innerHTML = "";
}
