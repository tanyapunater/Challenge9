import { Router, type Request, type Response } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// TODO: POST Request with city name to retrieve weather data
router.post("/", (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const city = req.body.city;
  if (!city) {
    return res.status(400).json({ error: "City name is required" });
  }
  WeatherService.getWeather(city)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch weather data" });
    });

  // TODO: save city to search history
  HistoryService.saveCity(city)
    .then(() => {
      console.log("City saved to history");
    })
    .catch((error) => {
      console.error("Failed to save city to history", error);
    });
});

// TODO: GET search history
router.get("/history", async (req: Request, res: Response) => {});

// * BONUS TODO: DELETE city from search history
router.delete("/history/:id", async (req: Request, res: Response) => {});
// * BONUS TODO: DELETE all search history

export default router;
