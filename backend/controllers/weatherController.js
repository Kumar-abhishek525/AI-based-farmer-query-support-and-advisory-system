// backend/controllers/weatherController.js
import WeatherLog from "../models/Weather.js";
import { fetchWeatherForLocation } from "../services/weatherService.js";

const CACHE_TTL_MINUTES = 30;

// @route GET /api/weather/:location
export const getWeather = async (req, res) => {
  try {
    const { location } = req.params;

    // Serve from cache if it's fresh, to avoid hitting the external API
    // on every single dashboard load
    const cached = await WeatherLog.findOne({ location }).sort({ fetchedAt: -1 });
    const isFresh =
      cached && Date.now() - new Date(cached.fetchedAt).getTime() < CACHE_TTL_MINUTES * 60 * 1000;

    if (isFresh) {
      return res.status(200).json(cached);
    }

    const weatherData = await fetchWeatherForLocation(location);

    const log = await WeatherLog.create({
      location,
      ...weatherData,
      fetchedAt: new Date(),
    });

    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch weather.", error: error.message });
  }
};