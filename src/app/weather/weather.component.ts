import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../model/weather/weather-response';
import { HttpClient } from '@angular/common/http';
import { Weather } from '../model/weather/weather';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  weatherResponse$: Observable<WeatherResponse>;
  baseUrl = 'https://pi.zhongpin.wang/api/weather/city/';
  // baseUrl = 'http://localhost:31415/weather/city/';
  // baseUrl = 'http://127.0.0.1/';
  // city = 'Hellschen-Heringsand-Unterschaar';
  city = 'Munich';
  apiKey = '0jbQxUhhH5WUnp66BUuEkSSrqQExxg7DLNXVPRR0XVFWkOgOEBY30IZ8lg7Ej6EN';
  weatherResponse: WeatherResponse;
  cityNameFontSize: string;

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
    }, 1000 * 60 * 10);
  }

  updateWeather(): void {
    if (this.city.length > 15) {
      this.cityNameFontSize = '7vw';
    } else if (this.city.length > 10) {
      this.cityNameFontSize = '10w';
    } else {
      this.cityNameFontSize = '14vw';
    }

    this.weatherResponse$ = this.http
      .get<WeatherResponse>(this.baseUrl + this.city + '/' + this.apiKey);
    // this.weatherResponse$.subscribe(r => this.weatherResponse = r);
    // if (this.weatherResponse === undefined) {
    //   this.weatherResponse = new WeatherResponse();
    //   this.weatherResponse.weather = new Weather();
    //   this.weatherResponse.weather.description = 'rain';
    //   this.weatherResponse.weather.icon = '10d';
    //   this.weatherResponse.weather.tempMax = 283;
    //   this.weatherResponse.weather.tempMin = 277;
    //   this.weatherResponse.weather.temp = 279;
    // }
  }

}
