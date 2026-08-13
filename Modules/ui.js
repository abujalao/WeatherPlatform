import { fetchLocation, fetchWeather, fetchForecast } from './api.js';
import { iconFolder, iconMapping } from './iconMapping.js';

export const searchBtn = document.querySelector('.button-search');
export const searchInput = document.querySelector('.input-search');

const resultFrame = document.querySelector('.result-frame');

const cityName = document.querySelector('.city-name')
const temp = document.querySelector('.data-temp')
const visibility = document.querySelector('.data-value-visibility')
const humidity = document.querySelector('.data-value-humidity')
const windSpeed = document.querySelector('.data-value-wind')
const pressure = document.querySelector('.data-value-pressure')
const forecastFrame = document.querySelector('.forecast-frame')
const mainWeatherIcon = document.querySelector('.weather-state-icon')


export function toggleSearch() {
    searchInput.classList.toggle('active');
    searchBtn.classList.toggle('active')
    if (searchInput.classList.contains('active')) {
        searchInput.focus()
    } else {
        searchInput.value = "";
    }
}

function getIcon(id,icon) {
    let iconCode = id+"-"+icon;
    if (!iconMapping[iconCode]) {
        iconCode="000-000"
    }
    return iconFolder+iconMapping[iconCode]

}
export function displayWeather(weather,forecast,city){
    cityName.innerHTML = city;
    temp.innerHTML = Math.round(weather.main.temp);
    windSpeed.innerHTML = weather.wind.speed;
    humidity.innerHTML= weather.main.humidity;
    pressure.innerHTML = weather.main.pressure;
    visibility.innerHTML = weather.visibility/1000;
    const imageAddress = getIcon(weather.weather[0].id, weather.weather[0].icon);
    mainWeatherIcon.src = imageAddress;
    forecastFrame.innerHTML=""
    let result=`<div class="forecast-item">
                <p class="forecast-time">Now</p>
                <img class="forecast-icon" src="${getIcon(weather.weather[0].id, weather.weather[0].icon)}">
                <p class="forecast-temp"><span class="forecast-value">${Math.round(weather.main.temp)}</span>&#176;</p>
            </div>`
    const stampArray = forecast.list
    stampArray.forEach((stamp) => {
        const date = new Date((stamp.dt + forecast.city.timezone) * 1000);
        const timeString = date.toLocaleTimeString([], { timeZone: 'UTC', hour: 'numeric', minute: '2-digit' });
        result+=`<div class="forecast-item">
                <p class="forecast-time">${timeString}</p>
                <img class="forecast-icon" src="${getIcon(stamp.weather[0].id, stamp.weather[0].icon)}">
                <p class="forecast-temp"><span class="forecast-value">${Math.round(stamp.main.temp)}</span>&#176;</p>
            </div>`
    });
    forecastFrame.innerHTML=result;
}

export function displaySearchResult(response, onCitySelect) {
    resultFrame.innerHTML = "";
    response.forEach(location => {
        let result = ""

        if (location.name) {
            result+=location.name+", ";
        }
        if (location.state && (location.name !== location.state)) {
            result+=location.state+", ";
        }
        if (location.country) {
            result+=location.country;
        }

        const button = document.createElement('button');
        button.className = 'button-result';
        button.textContent = result;
        resultFrame.appendChild(button);

        button.addEventListener('click', () => {
            onCitySelect(location);

            toggleSearch()
            resultFrame.innerHTML = "";
        });
        
    });
}