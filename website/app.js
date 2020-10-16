/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();


// Personal API Key for OpenWeatherMap API
const baseURL = 'http://api.openweathermap.org/data/2.5/weather';

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction() {
    const newZip = document.getElementById('zip').value;
    getWeather(baseURL, newZip, config.API_KEY)
        .then(getProjectData)
        .then(updateUI)
}

/* Function to GET Web API Data*/
const getWeather = async (baseURL, newZip, apiKey) => {
    const response = await fetch(`${baseURL}?zip=${newZip}&appid=${apiKey}`);
    try {
        // data - var to store what fetch() returns, in json format
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
}

/* Function to POST data */
const postWeather = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    try {
        const newData = await response.json();
    } catch (error) {
        console.log('error', error);
    }
}


/* Function to GET Project Data */
const getProjectData = data => {
    const userEntry = document.getElementById('feelings').value;
    postWeather('/add', {
        date: newDate,
        name: data.name,
        temperature: data.main.temp,
        icon: data.weather[0].icon,
        description: data.weather[0].description,
        userEntry: userEntry
    });
}

/* Function to Update UI */
const updateUI = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('name').innerHTML = allData.name;
        document.getElementById('temp').innerHTML = `${(allData.temperature - 273.15).toFixed()}°C (${((allData.temperature - 273.15) * 9 / 5 + 32).toFixed()}°F)`;
        document.getElementById('icon').innerHTML = `<img class="icon" src="http://openweathermap.org/img/wn/${allData.icon}@2x.png" alt="Weather icon">`;
        document.getElementById('description').innerHTML = allData.description;
        document.getElementById('content').innerHTML = allData.userEntry;

    } catch (error) {
        console.log('error', error);
    }
}