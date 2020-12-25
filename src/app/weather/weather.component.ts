import { Component, OnInit } from '@angular/core';
import { WeatherResponse } from '../model/weather/weather-response';
import { Weather } from '../model/weather/weather';
import { ActivatedRoute } from '@angular/router';
import {DailyWeatherResponse} from '../model/weather/daily-weather-response';
import {Coord} from '../model/weather/coord';
import {finalize} from 'rxjs/operators';
import {WeatherService} from './weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  weatherResponse: WeatherResponse;
  weatherResponseLoading = true;
  dailyWeatherResponse: DailyWeatherResponse;
  dailyWeatherResponseLoading = true;

  // baseUrl = 'http://localhost:31415/weather/city/';
  // baseUrl = 'http://127.0.0.1/';
  // city = 'Hellschen-Heringsand-Unterschaar';
  city = undefined;
  cityShort = undefined;

  cityNameFontSize: string;

  currentPage = 0;
  currentTimer = 0;

  constructor(
    private weatherService: WeatherService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // It enables customized width. If a specify display cannot show full width, this may solve the problem.
    this.route.queryParams.subscribe(params => {
      if (!isNaN(parseInt(params.w, 10))) {
        document.body.style.width = params.w + 'px';
      }
    });

    this.weatherResponse = new WeatherResponse();
    this.weatherResponse.weather = new Weather();
    this.weatherResponse.weather.description = 'rain';
    this.weatherResponse.weather.icon = '';
    this.weatherResponse.weather.tempMax = undefined;
    this.weatherResponse.weather.tempMin = undefined;
    this.weatherResponse.weather.temp = undefined;

    this.city = this.updateCityName();

    setInterval(() => {
      this.updateWeather();
    }, 1000 * 60 * 30);

    setInterval(() => {
      this.updateDailyWeather(this.weatherResponse.coord);
    }, 1000 * 60 * 60);

    setInterval(() => {
      this.currentTimer += 1;
      if (this.currentTimer === 1000) {
        this.currentTimer = 0;
        this.currentPage = (this.currentPage + 1) % 2;
      }
    }, 10);
  }

  updateCityName(): void {
    const jsonResponse$ = this.weatherService.getLocationByIP();
    jsonResponse$.subscribe(
      response => {
        const data = JSON.stringify(response);
        const jsonResponse = JSON.parse(data);
        if (jsonResponse === null || jsonResponse === undefined || jsonResponse.ipGeolocation === undefined) {
          this.city = 'Berlin, DE';
          this.cityShort = 'Berlin';
        } else {
          console.log(jsonResponse);
          this.city = jsonResponse.ipGeolocation.city + ', ' + jsonResponse.ipGeolocation.countryCode;
          this.cityShort = jsonResponse.ipGeolocation.city;
        }
        this.updateWeather();
    },
        error => {
        alert('Error: ' + error.name + '\nError Message: ' + error.message);
    });
  }

  updateWeather(): void {
    if (this.city.length > 12) {
      this.cityNameFontSize = '6vw';
    } else if (this.city.length > 7) {
      this.cityNameFontSize = '8vw';
    } else {
      this.cityNameFontSize = '10vw';
    }

    this.weatherResponseLoading = true;

    const weatherResponse$ = this.weatherService.getWeatherResponseByCity(this.city);
    weatherResponse$
      .pipe(finalize(() => this.weatherResponseLoading = false))
      .subscribe(r => this.weatherResponse = r);

    // call updateDailyWeather for the first time
    if (this.dailyWeatherResponse === undefined) {
      weatherResponse$.subscribe(r => {
        this.updateDailyWeather(r.coord);
      });
    }

  }

  updateDailyWeather(coord: Coord): void {
    this.dailyWeatherResponseLoading = true;
    const dailyWeatherResponse$ = this.weatherService.getDailyWeatherResponseByCoord(coord);
    dailyWeatherResponse$
      .pipe(finalize(() => this.dailyWeatherResponseLoading = false))
      .subscribe(r => {
        this.dailyWeatherResponse = r;
      });
  }
}
