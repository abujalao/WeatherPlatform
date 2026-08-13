const searchBtn = document.querySelector('.button-search');
const searchInput = document.querySelector('.input-search');
const resultFrame = document.querySelector('.result-frame');

const cityName = document.querySelector('.city-name')
const temp = document.querySelector('.data-temp')
const rain = document.querySelector('.data-value-rain')
const humidity = document.querySelector('.data-value-humidity')
const windSpeed = document.querySelector('.data-value-wind')
const uv = document.querySelector('.data-value-uv')


const myApiKey = CONFIG.WEATHER_API_KEY;
const SEARCH_RESULT_LIMIT = 5
let tempMode = false //0 celsius, 1 fahrenheit

function toggleSearch() {
    searchInput.classList.toggle('active');
    searchBtn.classList.toggle('active')
    if (searchInput.classList.contains('active')) {
        searchInput.focus()
    } else {
        searchInput.value = "";
    }
}

function displayWeather(weather) {
    temp.innerHTML = Math.round(weather.main.temp);
    windSpeed.innerHTML = weather.wind.speed;
    humidity.innerHTML= weather.main.humidity;
}

async function checkCityWeather(lat,lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=${tempMode? "imperial":"metric"}`);
        console.log(response);
        if (response.ok) {
            const weather = await response.json();
            displayWeather(weather);
        } else {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

function displaySearchResult(response) {
    resultFrame.innerHTML = "";
    response.forEach(element => {
        let result = ""
        if (element.name) {
            result+=element.name+", ";
        }
        if (element.state && (element.name !== element.state)) {
            result+=element.state+", ";
        }
        if (element.country) {
            result+=element.country;
        }
        console.log("CREATE")
        const button = document.createElement('button');
        button.className = 'button-result';
        button.textContent = result;
        resultFrame.appendChild(button);

        button.addEventListener('click', () => {
            console.log("LAT: "+element.lat+", LON: "+element.lon);
            checkCityWeather(element.lat,element.lon)
            toggleSearch()

            resultFrame.innerHTML = "";
            cityName.innerHTML = element.name;
        });
    });
}

async function searchLocation(userInput) {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=${SEARCH_RESULT_LIMIT}&appid=${myApiKey}`);
        if (response.ok) {
            const cities = await response.json();
            displaySearchResult(cities);
        } else {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch failed:', error);
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

