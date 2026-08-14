import * as ui from './Modules/ui.js';
import * as api from './Modules/api.js'
import * as storage from './Modules/storage.js'


async function setCity(location) {
    storage.saveCity(location);
    try{
        const unit = storage.tempMode;
        const [weather, forecast] = await Promise.all([
            api.fetchWeather(location.lat, location.lon,unit),
            api.fetchForecast(location.lat, location.lon,unit)
        ]);
        ui.displayWeather(unit,weather, forecast,location.name);
    } catch (error) {
        console.error("API error:", error);
        ui.displayWeatherError();
    }
    ui.displaySearchResult(storage.getSearchHistory(),setCity,true);
}

function loadLastCity() {
    const lastCity = storage.getLastSavedCity();

    if (lastCity) {
        setCity(lastCity);
    }
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

async function toggleUnit() {
    const tempMode = storage.toggleTempMode();
    ui.updateUnit(tempMode);
    loadLastCity(); //not optimal. api call just to change unit, maybe store it in storage.js and convert using calcualation
}

ui.activateSearchEvent(searchLocation);
ui.activateUnitToggle(storage.tempMode ,toggleUnit);
ui.displaySearchResult(storage.getSearchHistory(),setCity,true);
loadLastCity();

