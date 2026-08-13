import { searchBtn, searchInput, toggleSearch, displayWeather, displaySearchResult, displayWeatherError, displaySearchError } from './Modules/ui.js';
import * as api from './Modules/api.js'
let currentLatLon = [null,null]

async function setCity(location) {
    currentLatLon[0] = location.lat;
    currentLatLon[1] = location.lon;
    try{
        const [weather, forecast] = await Promise.all([
            api.fetchWeather(location.lat, location.lon),
            api.fetchForecast(location.lat, location.lon)
        ]);
        displayWeather(weather, forecast,location.name);
    } catch (error) {
        console.error("API error:", error);
        displayWeatherError();
    }
}

async function searchLocation(userInput) {
    try{
        const cities = await api.fetchLocation(userInput);
        displaySearchResult(cities, setCity);
    } catch (error) {
        console.error("API error:", error);
        displaySearchError();
    }
}

searchBtn.addEventListener("click", () => {
    if (searchInput.value.trim() !== "") {
            searchLocation(searchInput.value);
            return;
    }
    toggleSearch()
})

searchInput.addEventListener("keydown", (evnt)=> {
    if (evnt.key === "Enter") {
        searchLocation(searchInput.value);
    }
})

