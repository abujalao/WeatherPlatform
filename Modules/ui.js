import { fetchLocation, fetchWeather, fetchForecast } from './api.js';

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

export function toggleSearch() {
    searchInput.classList.toggle('active');
    searchBtn.classList.toggle('active')
    if (searchInput.classList.contains('active')) {
        searchInput.focus()
    } else {
        searchInput.value = "";
    }
}

export function displayWeather(weather,forecast){
    cityName.innerHTML = weather.name;
    temp.innerHTML = Math.round(weather.main.temp);
    windSpeed.innerHTML = weather.wind.speed;
    humidity.innerHTML= weather.main.humidity;
    pressure.innerHTML = weather.main.pressure;
    visibility.innerHTML = weather.visibility/1000;
    forecastFrame.innerHTML=""
    let result=""
    console.log(forecast)
    const stampArray = forecast.list
    stampArray.forEach((stamp) => {
        const date = new Date(stamp.dt * 1000);
        const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        result+=`<div class="forecast-item">
                <p class="forecast-time">${timeString}</p>
                <img class="forecast-icon" src="src/sunny.png">
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