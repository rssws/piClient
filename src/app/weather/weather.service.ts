import {Observable} from 'rxjs';
import {WeatherResponse} from '../model/weather/weather-response';
import {DailyWeatherResponse} from '../model/weather/daily-weather-response';
import {HttpClient} from '@angular/common/http';
import {Coord} from '../model/weather/coord';
import {JsonObject} from '@angular/compiler-cli/ngcc/src/packages/entry_point';
import {Injectable} from '@angular/core';
import {HourlyWeatherResponse} from '../model/weather/hourly-weather-response';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'https://pi.zhongpin.wang/api/';
  private piServiceApiKey = '0jbQxUhhH5WUnp66BUuEkSSrqQExxg7DLNXVPRR0XVFWkOgOEBY30IZ8lg7Ej6EN';

  // public getWeatherResponseByIP(): Observable<WeatherResponse> {
  //   return this.http
  //     .get<WeatherResponse>(
  //       this.baseUrl + 'weather/ip/' + this.piServiceApiKey);
  // }

  public getWeatherResponseByCity(city: string): Observable<WeatherResponse> {
    return this.http
      .get<WeatherResponse>(
        this.baseUrl + 'weather/city/' + city + '/' + this.piServiceApiKey);
  }

  public getDailyWeatherResponseByCoord(coord: Coord): Observable<DailyWeatherResponse> {
    return this.http
      .get<DailyWeatherResponse>(
        this.baseUrl + 'dailyWeather/coord/' + coord.lat + '/' + coord.lon + '/' + this.piServiceApiKey);
  }

  public getHourlyWeatherResponseByCoord(coord: Coord): Observable<HourlyWeatherResponse> {
    return this.http
      .get<HourlyWeatherResponse>(
        this.baseUrl + 'hourlyWeather/coord/' + coord.lat + '/' + coord.lon + '/' + this.piServiceApiKey);
  }

  public getLocationByIP(ipAddr = ''): Observable<string> {
    if (ipAddr === '') {
      return this.http
        .get<string>(this.baseUrl + 'ipGeolocation/' + this.piServiceApiKey);
    } else {
      return this.http
        .get<string>(this.baseUrl + 'ipGeolocation/' + ipAddr + '/' + this.piServiceApiKey);
    }

  }


}
