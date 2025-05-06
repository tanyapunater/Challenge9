import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  temperature: number;
  description: string;
  humidity: number;

  constructor(temperature: number, description: string, humidity: number) {
    this.temperature = temperature;
    this.description = description;
    this.humidity = humidity;
  }
}

// Complete the WeatherService class
class WeatherService {
  private baseURL: string = "https://api.openweathermap.org/data/2.5";
  private apiKey: string = process.env.OPENWEATHER_API_KEY || "";
  private cityName: string = "";

  // Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`
    );
    return response.data[0];
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return this.cityName;
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    const response = await axios.get(query);
    return response.data;
  }

  // Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.main.temp,
      response.weather[0].description,
      response.main.humidity
    );
  }

  // Complete buildForecastArray method
  private buildForecastArray(
    currentWeather: Weather,
    weatherData: any[]
  ): Weather[] {
    return weatherData.map((data) => {
      return new Weather(
        data.main.temp,
        data.weather[0].description,
        data.main.humidity
      );
    });
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();
