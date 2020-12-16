import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../model/weather/weather-response';
import { HttpClient } from '@angular/common/http';
import {Weather} from '../model/weather/weather';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  // TODO: Continue the implementaion
  weatherResponse$: Observable<WeatherResponse>;
  baseUrl = 'https://pi.zhongpin.wang/api/weather/city/';
  // baseUrl = 'http://localhost:31415/weather/city/';
  // baseUrl = 'http://127.0.0.1/';
  city = 'München';
  apiKey = '0jbQxUhhH5WUnp66BUuEkSSrqQExxg7DLNXVPRR0XVFWkOgOEBY30IZ8lg7Ej6EN';
  weatherResponse: WeatherResponse;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.updateWeather();
    setInterval(() => {
      this.updateWeather();
    }, 1000 * 3600);
  }

  updateWeather(): void {
      this.weatherResponse$ = this.http
        .get<WeatherResponse>(this.baseUrl + this.city + '/' + this.apiKey);
      this.weatherResponse$.subscribe(r => this.weatherResponse = r);
      if (this.weatherResponse === undefined) {
        this.weatherResponse = new WeatherResponse();
        this.weatherResponse.weather = new Weather();
        this.weatherResponse.weather.description = 'rain';
        this.weatherResponse.weather.icon = '10d';
        this.weatherResponse.weather.tempMax = 283;
        this.weatherResponse.weather.tempMin = 277;
        this.weatherResponse.weather.temp = 279;
      }
  }
}
