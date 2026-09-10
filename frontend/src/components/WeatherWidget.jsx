// src/components/WeatherWidget.jsx
import { useState, useEffect } from "react";
import { Cloud, CloudRain, Sun, Loader2 } from "lucide-react";
import api from "../services/api";

const conditionIcon = (condition = "") => {
  const c = condition.toLowerCase();
  if (c.includes("rain")) return <CloudRain size={32} className="text-blue-500" />;
  if (c.includes("cloud")) return <Cloud size={32} className="text-gray-400" />;
  return <Sun size={32} className="text-yellow-500" />;
};

const WeatherWidget = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/weather/${encodeURIComponent(location)}`);
        setWeather(res.data);
      } catch (err) {
        setError("Couldn't load weather right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  if (!location) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-500 mb-2">Weather in {location}</p>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 size={18} className="animate-spin" /> Loading...
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        weather && (
          <div className="flex items-center gap-4">
            {conditionIcon(weather.condition)}
            <div>
              <p className="text-2xl font-semibold">{weather.temperature}°C</p>
              <p className="text-sm text-gray-500 capitalize">
                {weather.condition}
              </p>
              <p className="text-xs text-gray-400">
                Humidity: {weather.humidity}% · Rain chance:{" "}
                {weather.rainChance ?? 0}%
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default WeatherWidget;