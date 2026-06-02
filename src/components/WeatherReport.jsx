import React, { useState } from 'react';
import './WeatherReport.css';

const WeatherReport = () => {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  const API_BASE_URL = 'http://localhost:8080/api/weather/current';

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a valid city name');
      return;
    }

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(cityName)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('City not found. Please try another city.');
        } else {
          setError('Error fetching weather data. Please try again.');
        }
        return;
      }

      const data = await response.json();
      setWeatherData(data);
      
      if (!searchHistory.includes(cityName)) {
        setSearchHistory([cityName, ...searchHistory.slice(0, 9)]);
      }
    } catch (err) {
      setError('Failed to connect to the weather service. Please check if the backend is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(cityInput);
    setCityInput('');
  };

  const handleHistoryClick = (city) => {
    fetchWeather(city);
  };

  return (
    <div className="min-vh-100 bg-gradient">
      <nav className="navbar navbar-dark bg-primary mb-5">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            <i className="bi bi-cloud-sun"></i> Weather Report
          </span>
        </div>
      </nav>

      <div className="container">
        {/* Search Section */}
        <div className="row mb-4">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow-lg border-0">
              <div className="card-body p-4">
                <h2 className="card-title text-center mb-4">Search Weather by City</h2>
                
                <form onSubmit={handleSearch}>
                  <div className="input-group input-group-lg">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter city name..."
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>Search
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Weather Data Display */}
        {weatherData && (
          <div className="row mb-4">
            <div className="col-lg-8 mx-auto">
              <div className="card shadow-lg border-0">
                <div className="card-header bg-primary text-white">
                  <h4 className="mb-0">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    {weatherData.city}
                  </h4>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    {/* Temperature */}
                    <div className="col-md-6 mb-3">
                      <div className="weather-metric">
                        <h5 className="text-muted">Temperature</h5>
                        <h2 className="display-4 text-primary">
                          {Math.round(weatherData.temperature)}°C
                        </h2>
                      </div>
                    </div>

                    {/* Condition */}
                    <div className="col-md-6 mb-3">
                      <div className="weather-metric">
                        <h5 className="text-muted">Condition</h5>
                        <h3 className="text-capitalize mb-2">{weatherData.condition}</h3>
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Humidity */}
                  <div className="row mt-3">
                    <div className="col-md-12 text-center">
                      <div className="detail-box">
                        <h6 className="text-muted">Humidity</h6>
                        <h4 className="text-info">{Math.round(weatherData.humidity)}%</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto">
              <div className="card shadow-lg border-0">
                <div className="card-header bg-secondary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-clock-history me-2"></i>
                    Recent Searches
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex flex-wrap gap-2">
                    {searchHistory.map((city, index) => (
                      <button
                        key={index}
                        className="btn btn-outline-primary"
                        onClick={() => handleHistoryClick(city)}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!weatherData && !loading && (
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card shadow-lg border-0 text-center py-5">
                <div className="card-body">
                  <i className="bi bi-cloud-sun display-1 text-muted mb-3"></i>
                  <h4 className="text-muted">No weather data yet</h4>
                  <p className="text-secondary">Enter a city name above to get started</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherReport;