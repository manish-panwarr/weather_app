const apikey = "44fcac6bfcf4b86a6b00c9be7467b491";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const weatherDisplay = document.querySelector(".weather");
const errorDisplay = document.querySelector(".error");
const loader = document.querySelector(".loader");
const initialPrompt = document.querySelector(".initial-prompt");

/**
 * Updates the background and icon based on the weather condition.
 * @param {string} weatherMain - The main weather condition from the API (e.g., "Clouds", "Rain").
 */
function updateUI(weatherMain) {
    // Set a default class and remove all weather-specific classes
    document.body.className = 'weather-bg-default';

    let iconSrc = '';
    let bgClass = '';

    switch (weatherMain) {
        case "Clouds":
            iconSrc = "images/clouds.png";
            bgClass = 'weather-bg-clouds';
            break;
        case "Clear":
            iconSrc = "images/clear.png";
            bgClass = 'weather-bg-clear';
            break;
        case "Rain":
            iconSrc = "images/rain.png";
            bgClass = 'weather-bg-rain';
            break;
        case "Drizzle":
            iconSrc = "images/drizzle.png";
            bgClass = 'weather-bg-drizzle';
            break;
        case "Mist":
        case "Haze":
        case "Fog":
            iconSrc = "images/mist.png";
            bgClass = 'weather-bg-mist';
            break;
        case "Snow":
            iconSrc = "images/snow.png"; // Assuming you have a snow.png
            bgClass = 'weather-bg-snow';
            break;
        case "Thunderstorm":
            iconSrc = "images/thunderstorm.png"; // Assuming you have a thunderstorm.png
            bgClass = 'weather-bg-thunderstorm';
            break;
        default:
            iconSrc = "images/clear.png"; // A sensible default
            bgClass = 'weather-bg-default';
    }
    weatherIcon.src = iconSrc;
    document.body.classList.add(bgClass);
}


async function checkWeather(city) {
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    initialPrompt.style.display = "none";
    weatherDisplay.classList.remove("visible");
    errorDisplay.style.display = "none";
    loader.style.display = "block";

    try {
        const response = await fetch(apiUrl + city + `&appid=${apikey}`);
        
        if (!response.ok) {
            // Handle 404 (city not found) and other HTTP errors
            errorDisplay.style.display = "block";
            weatherDisplay.classList.remove("visible");
            document.body.className = 'weather-bg-default'; // Reset background on error
            return;
        }

        const data = await response.json();
        
        // Update text content
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + " km/h";

        // Update background and icon
        updateUI(data.weather[0].main);

        // Show weather info with animation
        errorDisplay.style.display = "none";
        weatherDisplay.classList.add("visible");

    } catch (error) {
        console.error("Fetch error:", error);
        errorDisplay.querySelector('p').textContent = "An error occurred. Please check your connection.";
        errorDisplay.style.display = "block";
        weatherDisplay.classList.remove("visible");
        document.body.className = 'weather-bg-default'; // Reset background on error
    } finally {
        loader.style.display = "none";
    }
}

function handleSearch() {
    const city = searchBox.value.trim();
    checkWeather(city);
}

searchBtn.addEventListener("click", handleSearch);

searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents form submission if it were in a form
        handleSearch();
    }
});