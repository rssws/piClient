import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../model/weather/weather-response';
import { HttpClient } from '@angular/common/http';
import { Weather } from '../model/weather/weather';
import { ActivatedRoute } from '@angular/router';
import {DailyWeatherResponse} from '../model/weather/daily-weather-response';
import {Coord} from '../model/weather/coord';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  baseUrl = 'https://pi.zhongpin.wang/api/';

  weatherResponse: WeatherResponse;
  weatherResponse$: Observable<WeatherResponse>;
  weatherResponseLoading = true;
  dailyWeatherResponse: DailyWeatherResponse;
  dailyWeatherResponse$: Observable<DailyWeatherResponse>;
  dailyWeatherResponseLoading = true;

  // baseUrl = 'http://localhost:31415/weather/city/';
  // baseUrl = 'http://127.0.0.1/';
  // city = 'Hellschen-Heringsand-Unterschaar';
  city = 'Munich';
  apiKey = '0jbQxUhhH5WUnp66BUuEkSSrqQExxg7DLNXVPRR0XVFWkOgOEBY30IZ8lg7Ej6EN';

  cityNameFontSize: string;

  currentPage = 0;
  currentTimer = 0;

  constructor(
    private http: HttpClient,
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

    this.updateWeather();

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

  updateWeather(): void {
    if (this.city.length > 15) {
      this.cityNameFontSize = '7vw';
    } else if (this.city.length > 10) {
      this.cityNameFontSize = '10w';
    } else {
      this.cityNameFontSize = '13vw';
    }

    this.weatherResponseLoading = true;

    this.weatherResponse$ = this.http
      .get<WeatherResponse>(this.baseUrl + 'weather/city/' + this.city + '/' + this.apiKey);

    this.weatherResponse$
      .pipe(finalize(() => this.weatherResponseLoading = false))
      .subscribe(r => this.weatherResponse = r);

    // call updateDailyWeather for the first time
    if (this.dailyWeatherResponse === undefined) {
      this.weatherResponse$.subscribe(r => {
        this.updateDailyWeather(r.coord);
      });
    }

  }

  updateDailyWeather(coord: Coord): void {
    this.dailyWeatherResponseLoading = true;
    this.dailyWeatherResponse$ = this.http
      .get<DailyWeatherResponse>(
        this.baseUrl +
        'dailyWeather/coord/' +
        coord.lat +
        '/' + coord.lon +
        '/' + this.apiKey);
    this.dailyWeatherResponse$
      .pipe(finalize(() => this.dailyWeatherResponseLoading = false))
      .subscribe(r => {
        this.dailyWeatherResponse = r;
      });
  }

}
