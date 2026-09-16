

const API_KEY = " YOUR_API_KEY ";

const WEATHER_API =
    "https://api.openweathermap.org/data/2.5/weather";

const FORECAST_API =
    "https://api.openweathermap.org/data/2.5/forecast";


const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const locationBtn =
    document.getElementById("locationBtn");

const themeBtn =
    document.getElementById("themeBtn");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const errorMessage =
    document.getElementById("errorMessage");

const weatherContent =
    document.getElementById("weatherContent");

const cityName =
    document.getElementById("cityName");

const dateElement =
    document.getElementById("date");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const description =
    document.getElementById("description");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const visibility =
    document.getElementById("visibility");

const feelsLike =
    document.getElementById("feelsLike");

const forecastContainer =
    document.getElementById("forecast");



searchBtn.addEventListener("click", () => {

    const city =
        cityInput.value.trim();

    if (!city) {

        showError("Please enter a city name.");

        return;
    }

    getWeather(city);
});


cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});

async function getWeather(city) {

    showLoading();

    try {

        const weatherURL =
            `${WEATHER_API}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const forecastURL =
            `${FORECAST_API}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const weatherResponse =
            await fetch(weatherURL);

        const weatherData =
            await weatherResponse.json();

        console.log("Weather API:", weatherData);

        if (!weatherResponse.ok) {
            throw new Error(
                weatherData.message || "Weather API error"
            );
        }

        const forecastResponse =
            await fetch(forecastURL);

        const forecastData =
            await forecastResponse.json();

        console.log("Forecast API:", forecastData);

        if (!forecastResponse.ok) {
            throw new Error(
                forecastData.message || "Forecast API error"
            );
        }

        displayWeather(weatherData);

        displayForecast(forecastData);

        hideLoading();

    }

    catch (err) {

        hideLoading();

        console.error("Error:", err);

        showError(err.message);

    }

}


// ==========================================
// DISPLAY CURRENT WEATHER
// ==========================================

function displayWeather(data) {

    weatherContent.classList.remove("hidden");

    error.classList.add("hidden");


    cityName.textContent =
        `${data.name}, ${data.sys.country}`;


    dateElement.textContent =
        formatDate();


    temperature.textContent =
        Math.round(data.main.temp);


    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;


    humidity.textContent =
        `${data.main.humidity}%`;


    wind.textContent =
        `${Math.round(data.wind.speed * 3.6)} km/h`;


    visibility.textContent =
        `${(data.visibility / 1000).toFixed(1)} km`;


    description.textContent =
        data.weather[0].description;


    weatherIcon.textContent =
        getWeatherIcon(
            data.weather[0].main
        );

}


// ==========================================
// DISPLAY FORECAST
// ==========================================

function displayForecast(data) {

    forecastContainer.innerHTML = "";


    const dailyData = {};


    data.list.forEach(item => {

        const date =
            item.dt_txt.split(" ")[0];


        if (!dailyData[date]) {

            dailyData[date] = item;

        }

    });


    const days =
        Object.values(dailyData)
            .slice(1, 6);


    days.forEach(day => {

        const card =
            document.createElement("div");


        card.classList.add(
            "forecast-card"
        );


        const date =
            new Date(day.dt * 1000);


        const dayName =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        card.innerHTML = `

            <div class="forecast-day">
                ${dayName}
            </div>

            <div class="forecast-icon">
                ${getWeatherIcon(
                    day.weather[0].main
                )}
            </div>

            <div class="forecast-temp">
                ${Math.round(day.main.temp)}°C
            </div>

            <div class="forecast-description">
                ${day.weather[0].description}
            </div>

        `;


        forecastContainer.appendChild(card);

    });

}


// ==========================================
// WEATHER ICON
// ==========================================

function getWeatherIcon(condition) {

    const icons = {

        Clear: "☀️",

        Clouds: "☁️",

        Rain: "🌧️",

        Drizzle: "🌦️",

        Thunderstorm: "⛈️",

        Snow: "❄️",

        Mist: "🌫️",

        Smoke: "🌫️",

        Haze: "🌫️",

        Dust: "🌪️",

        Fog: "🌫️",

        Sand: "🌪️",

        Ash: "🌋",

        Squall: "💨",

        Tornado: "🌪️"

    };


    return icons[condition] || "🌤️";

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate() {

    const today =
        new Date();


    return today.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    loading.classList.remove("hidden");

    weatherContent.classList.add("hidden");

    error.classList.add("hidden");

}


function hideLoading() {

    loading.classList.add("hidden");

}


// ==========================================
// ERROR
// ==========================================

function showError(message) {

    error.classList.remove("hidden");

    errorMessage.textContent = message;

    weatherContent.classList.add("hidden");

}


// ==========================================
// CURRENT LOCATION
// ==========================================

locationBtn.addEventListener(
    "click",
    () => {

        if (!navigator.geolocation) {

            showError(
                "Geolocation is not supported by your browser."
            );

            return;

        }


        showLoading();


        navigator.geolocation.getCurrentPosition(

            position => {

                const lat =
                    position.coords.latitude;

                const lon =
                    position.coords.longitude;


                getWeatherByCoordinates(
                    lat,
                    lon
                );

            },

            () => {

                hideLoading();

                showError(
                    "Unable to access your location."
                );

            }

        );

    }
);


// ==========================================
// WEATHER BY COORDINATES
// ==========================================

async function getWeatherByCoordinates(
    lat,
    lon
) {

    try {

        const weatherURL =
            `${WEATHER_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;


        const forecastURL =
            `${FORECAST_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;


        const weatherResponse =
            await fetch(weatherURL);


        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to fetch current weather."
            );

        }


        const weatherData =
            await weatherResponse.json();


        const forecastResponse =
            await fetch(forecastURL);


        if (!forecastResponse.ok) {

            throw new Error(
                "Unable to fetch forecast."
            );

        }


        const forecastData =
            await forecastResponse.json();


        displayWeather(weatherData);

        displayForecast(forecastData);

        hideLoading();

    }

    catch (err) {

        hideLoading();

        showError(
            err.message ||
            "Unable to fetch location weather."
        );

    }

}


// ==========================================
// DARK / LIGHT MODE
// ==========================================

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");


        if (
            document.body.classList.contains("dark")
        ) {

            themeBtn.textContent = "☀️";

            localStorage.setItem(
                "theme",
                "dark"
            );

        }

        else {

            themeBtn.textContent = "🌙";

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }
);


// ==========================================
// LOAD SAVED THEME
// ==========================================

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}


// ==========================================
// DEFAULT CITY
// ==========================================

getWeather("Jaipur");
