import { searchBtn, searchInput, toggleSearch, displayWeather, displaySearchResult } from './Modules/ui.js';
import * as api from './Modules/api.js'
let currentLatLon = [null,null]

async function setCity(location) {
    currentLatLon[0] = location.lat;
    currentLatLon[1] = location.lon;
    const weather = await api.fetchWeather(location.lat,location.lon);
    const forecast = await api.fetchForecast(location.lat,location.lon);
    displayWeather(weather, forecast,location.name);
}

async function searchLocation(userInput) {
    const cities = await api.fetchLocation(userInput);
    displaySearchResult(cities, setCity);
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

