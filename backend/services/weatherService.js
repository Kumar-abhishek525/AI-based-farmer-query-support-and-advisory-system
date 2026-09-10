// backend/services/weatherService.js
import axios from "axios";
import { WEATHER_API_KEY } from "../config/env.js";

// Using OpenWeatherMap as the example provider — swap the URL/parsing
// if you use a different weather API
// @param location - city/district name, e.g. "Gorakhpur"
// @returns { temperature, condition, humidity, rainChance, windSpeed }
export const fetchWeatherForLocation = async (location) => {
  try {
    const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: `${location},IN`,
        appid: WEATHER_API_KEY,
        units: "metric",
      },
    });

    const data = res.data;

    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0]?.main || "Clear",
      humidity: data.main.humidity,
      rainChance: data.rain ? Math.min(100, Math.round(data.rain["1h"] * 10)) : 0,
      windSpeed: data.wind?.speed || 0,
    };
  } catch (error) {
    console.error("Weather service error:", error.response?.data || error.message);
    throw new Error("Could not fetch weather data for this location.");
  }
};