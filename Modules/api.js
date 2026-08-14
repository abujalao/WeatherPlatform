const myApiKey = CONFIG.WEATHER_API_KEY;

const SEARCH_RESULT_LIMIT = 5
const FORECAST_STAMPS = 8;

export async function fetchForecast(lat,lon,tempMode) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=${tempMode? "imperial":"metric"}&cnt=${FORECAST_STAMPS}`);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

export async function fetchWeather(lat,lon,tempMode) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=${tempMode? "imperial":"metric"}`);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

export async function fetchLocation(userInput) {
    try {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=${SEARCH_RESULT_LIMIT}&appid=${myApiKey}`);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}