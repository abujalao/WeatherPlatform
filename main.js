import * as ui from './Modules/ui.js';
import * as api from './Modules/api.js'
import * as storage from './Modules/storage.js'

async function setCity(location) {
    storage.saveCity(location);
    try{
        const [weather, forecast] = await Promise.all([
            api.fetchWeather(location.lat, location.lon),
            api.fetchForecast(location.lat, location.lon)
        ]);
        ui.displayWeather(weather, forecast,location.name);
    } catch (error) {
        console.error("API error:", error);
        ui.displayWeatherError();
    }
    ui.displaySearchResult(storage.getSearchHistory(),setCity,true);
}

async function searchLocation(userInput) {
    try{
        const cities = await api.fetchLocation(userInput);
        ui.displaySearchResult(cities, setCity);
    } catch (error) {
        console.error("API error:", error);
        ui.displaySearchError();
    }
}

ui.searchBtn.addEventListener("click", () => {
    if (ui.searchInput.value.trim() !== "") {
            searchLocation(ui.searchInput.value);
            return;
    }
    ui.toggleSearch()
})

ui.searchInput.addEventListener("keydown", (evnt)=> {
    if (evnt.key === "Enter") {
        searchLocation(ui.searchInput.value);
    }
})

ui.displaySearchResult(storage.getSearchHistory(),setCity,true);
const lastCity = storage.getLastSavedCity();

if (lastCity) {
    setCity(lastCity);
}
