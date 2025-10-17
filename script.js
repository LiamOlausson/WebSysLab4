const weatherApiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your key
const openUvApiKey = 'YOUR_OPENUV_API_KEY'; // Replace with your key

const troyCoordinates = {
    lat: 42.7284,
    lon: -73.6918
};

// Fetch Weather
fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${troyCoordinates.lat}&lon=${troyCoordinates.lon}&units=imperial&appid=${weatherApiKey}`)
    .then(response => response.json())
    .then(data => {
        const weatherDiv = document.getElementById('weather');
        const icon = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const conditionMain = data.weather[0].main.toLowerCase(); // e.g., "Clear", "Rain", etc.
        const conditionDescription = data.weather[0].description;

        weatherDiv.innerHTML = `
      <div class="text-center mb-3">
        <img src="${iconUrl}" alt="Weather Icon" class="mb-2">
        <h3 class="fw-semibold">${conditionDescription}</h3>
      </div>
      <p><strong>🌡️ Temp:</strong> ${data.main.temp} °F</p>
      <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>💨 Wind Speed:</strong> ${data.wind.speed} mph</p>
      <p><strong>🌅 Sunrise:</strong> ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
      <p><strong>🌇 Sunset:</strong> ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
    `;

        // Set background class based on weather condition
        document.body.className = ''; // Reset any existing class
        switch (conditionMain) {
            case 'clear':
                document.body.classList.add('clear');
                break;
            case 'clouds':
                document.body.classList.add('clouds');
                break;
            case 'rain':
            case 'drizzle':
                document.body.classList.add('rain');
                break;
            case 'thunderstorm':
                document.body.classList.add('thunderstorm');
                break;
            case 'snow':
                document.body.classList.add('snow');
                break;
            case 'mist':
            case 'fog':
            case 'haze':
                document.body.classList.add('mist');
                break;
            default:
                // Keep default background
                break;
        }
    })
    .catch(error => {
        console.error('Weather fetch error:', error);
        document.getElementById('weather').innerHTML = '<div class="text-danger">Failed to load weather data.</div>';
    });


// Fetch UV Index
fetch(`https://api.openuv.io/api/v1/uv?lat=${troyCoordinates.lat}&lng=${troyCoordinates.lon}`, {
    headers: {
        'x-access-token': openUvApiKey
    }
})
    .then(response => response.json())
    .then(data => {
        const uv = data.result.uv;
        const uvDiv = document.getElementById('uv');
        const safeTime = data.result.safe_exposure_time.st2 || 'N/A';
        const uvMax = data.result.uv_max;
        const uvMaxTime = new Date(data.result.uv_max_time).toLocaleTimeString();

        let uvClass = 'uv-low';
        if (uv >= 3 && uv < 6) uvClass = 'uv-moderate';
        else if (uv >= 6 && uv < 8) uvClass = 'uv-high';
        else if (uv >= 8 && uv < 11) uvClass = 'uv-very-high';
        else if (uv >= 11) uvClass = 'uv-extreme';

        uvDiv.innerHTML = `
      <div class="p-3 rounded ${uvClass}">
        <p><strong>🌞 Current UV Index:</strong> ${uv.toFixed(1)}</p>
        <p><strong>🕒 Max UV Today:</strong> ${uvMax} at ${uvMaxTime}</p>
        <p><strong>🧴 Safe Exposure (Skin Type 2):</strong> ${safeTime} min</p>
        <small class="text-muted">UV levels are color-coded for safety awareness.</small>
      </div>
    `;
    })
    .catch(error => {
        console.error('UV fetch error:', error);
        document.getElementById('uv').innerHTML = '<div class="text-danger">Failed to load UV data.</div>';
    });
