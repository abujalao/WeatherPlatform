import { iconFolder, iconMapping } from './iconMapping.js';

const searchBtn = document.querySelector('.button-search');
const searchInput = document.querySelector('.input-search');

const resultFrame = document.querySelector('.search-results-frame');
const historyResultFrame = document.querySelector('.search-history-frame');

const cityName = document.querySelector('.city-name');
const temp = document.querySelector('.data-temp');
const visibility = document.querySelector('.data-value-visibility');
const humidity = document.querySelector('.data-value-humidity');
const windSpeed = document.querySelector('.data-value-wind');
const pressure = document.querySelector('.data-value-pressure');
const forecastFrame = document.querySelector('.forecast-frame');
const mainWeatherIcon = document.querySelector('.weather-state-icon');
const description = document.querySelector('.weather-desc');
const highTemp = document.querySelector('.temp-high');
const lowTemp = document.querySelector('.temp-low');
const searchResetBtn = document.querySelector('.button-reset-search');
const unitButton = document.querySelector('.button-unit-toggle');
const speedUnit = document.querySelector('.speed-unit');

const unitOptions = document.querySelectorAll('.unit-option');

export function updateUnit(tempMode) {
    if (!tempMode) {
        unitOptions[0].classList.add("active");
        unitOptions[1].classList.remove("active");
    } else {
        unitOptions[1].classList.add("active");
        unitOptions[0].classList.remove("active");
    }
}
function toggleSearch() {
    searchInput.classList.toggle('active');
    searchBtn.classList.toggle('active');
    if (searchInput.classList.contains('active')) {
        searchInput.focus();
    } else {
        searchInput.value = "";
        searchResetBtn.style.display = "none";
        resultFrame.innerHTML= "";
    }
}

function getIcon(id="000",icon="000") {
    let iconCode = id+"-"+icon;
    if (!iconMapping[iconCode]) {
        iconCode="000-000"
    }
    return iconFolder+iconMapping[iconCode];

}

export function displayWeather(unit,response,forecast,city){
    cityName.innerHTML = city;
    temp.innerHTML = Math.round(response.main.temp);
    windSpeed.innerHTML = response.wind.speed;
    humidity.innerHTML= response.main.humidity;
    pressure.innerHTML = response.main.pressure;
    visibility.innerHTML = response.visibility/1000;
    speedUnit.innerHTML = unit? "mph":"m/s";
    const midText = response.weather[0].description.length > 20 ? response.weather[0].main : response.weather[0].description;
    description.innerHTML = midText;

    const imageAddress = getIcon(response.weather[0].id, response.weather[0].icon);
    mainWeatherIcon.src = imageAddress;
    forecastFrame.innerHTML=""
    let result=`<div class="forecast-item">
                <p class="forecast-time">Now</p>
                <img class="forecast-icon" src="${getIcon(response.weather[0].id, response.weather[0].icon)}">
                <p class="forecast-temp"><span class="forecast-value">${Math.round(response.main.temp)}</span>&#176;</p>
                </div>`
    let tempMax = response.main.temp;
    let tempMin = response.main.temp;
    const stampArray = forecast.list

    stampArray.forEach((stamp, index) => {
        const date = new Date((stamp.dt + forecast.city.timezone) * 1000);
        const timeString = date.toLocaleTimeString([], { timeZone: 'UTC', hour: 'numeric', minute: '2-digit' });
        result+=`<div class="forecast-item">
                <p class="forecast-time">${timeString}</p>
                <img class="forecast-icon" src="${getIcon(stamp.weather[0].id, stamp.weather[0].icon)}">
                <p class="forecast-temp"><span class="forecast-value">${Math.round(stamp.main.temp)}</span>&#176;</p>
                </div>`
        if (stamp.main.temp > tempMax) {
            tempMax= stamp.main.temp;
        } else if ((stamp.main.temp < tempMin)) {
            tempMin= stamp.main.temp;
        }
    });
    forecastFrame.innerHTML=result;
    highTemp.innerHTML = Math.round(tempMax);
    lowTemp.innerHTML = Math.round(tempMin);
}

function getStringFromLocation(location) {
    let locationStr = "";
    if (location.name) {
        locationStr+=location.name+", ";
    }
    if (location.state && (location.name !== location.state)) {
        locationStr+=location.state+", ";
    }
    if (location.country) {
        locationStr+=location.country;
    }
    return locationStr;
}

function createSearchButton(isHistory,result,eventFunction) {
    const button = document.createElement('button');
    button.className = isHistory? 'button-result-history' : 'button-result';
    if (isHistory) {
        button.innerHTML = '<img src="src/history.png" class="search-history-icon">';
    }
    button.innerHTML+=result;
    button.addEventListener('click', eventFunction);
    return button;
}

export function displaySearchResult(response, onCitySelect,isHistory=false) {
    const frame = isHistory? historyResultFrame : resultFrame;
    frame.innerHTML = "";
    if (!isHistory && response.length === 0) {
        frame.innerHTML='<p class="search-info">No result found</p>'
    }
    response.forEach(location => {
        const result = getStringFromLocation(location);
        const button = createSearchButton(isHistory,result, () => {
            onCitySelect(location);
            toggleSearch()
            frame.innerHTML = "";
        });
        frame.appendChild(button);
    });
}

export function displayWeatherError(){
    cityName.innerHTML="Error";
    description.innerHTML= "Try again later";
    mainWeatherIcon.src=getIcon();
}

export function displaySearchError() {
    resultFrame.innerHTML='<p class="search-info">Search API Error</p>'
}

export function activateSearchEvent(searchFunction) {
    searchBtn.addEventListener("click", () => {
        if (searchInput.value.trim() !== "") {
                searchFunction(searchInput.value);
                return;
        }
        toggleSearch()
    })

    searchInput.addEventListener("keydown", (evnt)=> {
        if (evnt.key === "Enter") {
            searchFunction(searchInput.value);
        }
    })
}

searchInput.addEventListener("input", (event) => {
    if (event.target.value !== "") {
        searchResetBtn.style.display = "block";
    } else {
        searchResetBtn.style.display = "none";
    }
});

searchResetBtn.addEventListener("click", (event)=>{
    if (searchInput.classList.contains('active')) {
        toggleSearch();
    }
});

export function activateUnitToggle(tempMode,toggleFunction) {
    updateUnit(tempMode);
    unitButton.addEventListener("click", (event) => {
        toggleFunction();
    }); 
}


