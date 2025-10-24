import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playBeep } from '../utils/sound';
import { STORAGE_KEYS } from '../utils/storage';

function WeatherModule() {
  const [weatherData, setWeatherData] = useLocalStorage(STORAGE_KEYS.WEATHER, {
    city: '',
    data: null,
    lastFetch: null
  });
  
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('OFFLINE');
  const inputRef = useRef(null);

  useEffect(() => {
    // Check if cached data is still fresh (less than 1 hour old)
    if (weatherData.data && weatherData.lastFetch) {
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - weatherData.lastFetch < oneHour) {
        setStatus('CACHED');
      } else {
        setStatus('OFFLINE');
      }
    }
  }, [weatherData.data, weatherData.lastFetch]);

  const generateMockWeatherData = (city) => {
    const temp = Math.floor(Math.random() * 30) + 10; // 10-40°C
    const conditions = ['Clear', 'Cloudy', 'Rainy', 'Sunny', 'Partly Cloudy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      city: city,
      temp: temp,
      feels_like: temp + Math.floor(Math.random() * 5) - 2,
      condition: condition,
      humidity: Math.floor(Math.random() * 40) + 40,
      wind_speed: Math.floor(Math.random() * 20) + 5,
      timestamp: new Date().toLocaleString()
    };
  };

  const fetchWeather = async (e) => {
    e.preventDefault();
    const city = inputValue.trim();
    
    if (city === '') return;
    
    setStatus('LOADING...');
    
    // Mock weather data for offline mode
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockData = generateMockWeatherData(city);
    const newWeatherData = {
      city: city,
      data: mockData,
      lastFetch: Date.now()
    };
    
    setWeatherData(newWeatherData);
    setStatus('CACHED');
    setInputValue('');
    playBeep();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName !== 'INPUT') {
        // Focus weather input with '3'
        if (e.key === '3') {
          e.preventDefault();
          inputRef.current?.focus();
          playBeep();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const statusClass = status === 'LOADING...' ? 'loading' : '';

  return (
    <section className="module" id="weather-module">
      <div className="module-header">
        <h2>[3] WEATHER INFO</h2>
        <span className={`module-status ${statusClass}`} id="weather-status">{status}</span>
      </div>
      <div className="module-content weather-content">
        <form onSubmit={fetchWeather} className="weather-form">
          <input 
            ref={inputRef}
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="> Enter city name..." 
            autoComplete="off"
          />
        </form>
        <div id="weather-display" className="weather-display">
          {weatherData.data ? (
            <>
              <div>
                <p style={{ fontSize: '28px', letterSpacing: '2px' }}>
                  {weatherData.data.city.toUpperCase()}
                </p>
                <div className="weather-temp">{weatherData.data.temp}°C</div>
                <p>Condition: {weatherData.data.condition}</p>
              </div>
              <div className="weather-details">
                <div className="weather-detail">
                  <span>Feels Like:</span>
                  <span>{weatherData.data.feels_like}°C</span>
                </div>
                <div className="weather-detail">
                  <span>Humidity:</span>
                  <span>{weatherData.data.humidity}%</span>
                </div>
                <div className="weather-detail">
                  <span>Wind Speed:</span>
                  <span>{weatherData.data.wind_speed} km/h</span>
                </div>
                <div className="weather-detail">
                  <span>Updated:</span>
                  <span>{weatherData.data.timestamp}</span>
                </div>
              </div>
              <p className="weather-note" style={{ marginTop: '15px' }}>
                Note: Mock data for offline mode
              </p>
            </>
          ) : (
            <>
              <p>Enter city name to get weather data</p>
              <p className="weather-note">Note: Uses OpenWeather API</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default WeatherModule;
