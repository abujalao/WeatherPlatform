const profile = localStorage.getItem("searchHistory");
let searchHistory = [];
const HISTORY_LIMIT = 5;

if (profile !== null) {
    searchHistory= JSON.parse(profile);
}

export function saveCity(newLocation) {
    const isDupeIndex = searchHistory.findIndex(city => city.name === newLocation.name && city.state === newLocation.state && city.country === newLocation.country);
    if (isDupeIndex!==-1) {
        searchHistory.splice(isDupeIndex,1);
    }
    
    searchHistory.push(newLocation);

    if(searchHistory.length > HISTORY_LIMIT) {
        searchHistory.shift();
    }  

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}


export function getSearchHistory() {
    return searchHistory;
}

export function getLastSavedCity() {
    return searchHistory[searchHistory.length-1]
}