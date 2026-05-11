document.getElementById('getWeather').addEventListener('click', async () => {
  const city = document.getElementById('city').value.trim();

  if (!city) {
    alert('Please enter a city name!');
    return;
  }

  try {
    // Step 1: Use Open-Meteo geocoding API to get lat/lon
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert('City not found. Please check spelling.');
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Fetch current weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const temp = weatherData.current_weather.temperature;
    const wind = weatherData.current_weather.windspeed;
    const code = weatherData.current_weather.weathercode;

    // Step 3: Display weather
    document.getElementById('temperature').innerText = `${temp}°C`;
    document.getElementById('details').innerText = `Wind: ${wind} km/h`;
    document.getElementById('location').innerText = `${name}, ${country}`;
    document.getElementById('weatherIcon').innerText = getWeatherIcon(code);

  } catch (err) {
    console.error(err);
    alert('Error fetching weather. Try again later.');
  }
});

function getWeatherIcon(code) {
  if ([0].includes(code)) return '☀️'; // Clear sky
  if ([1,2,3].includes(code)) return '⛅'; // Partly cloudy
  if ([45,48].includes(code)) return '🌫️'; // Fog
  if ([51,53,55].includes(code)) return '🌦️'; // Drizzle
  if ([61,63,65].includes(code)) return '🌧️'; // Rain
  if ([71,73,75].includes(code)) return '❄️'; // Snow
  if ([80,81,82].includes(code)) return '🌧️'; // Showers
  if ([95,96,99].includes(code)) return '⛈️'; // Thunderstorm
  return '🌈';
}