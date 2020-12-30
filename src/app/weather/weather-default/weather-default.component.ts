import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {WeatherResponse} from '../../model/weather/weather-response';
import {Weather} from '../../model/weather/weather';
import {WeatherService} from '../weather.service';
import {finalize} from 'rxjs/operators';
import {Coord} from '../../model/weather/coord';

@Component({
  selector: 'app-weather-default',
  templateUrl: './weather-default.component.html',
  styleUrls: ['./weather-default.component.css']
})
export class WeatherDefaultComponent implements OnInit, OnChanges{

  @Input() city: string;
  @Input() cityShort: string;
  @Output() notifyCoord: EventEmitter<Coord> = new EventEmitter<Coord>();

  weatherResponse: WeatherResponse;
  weatherResponseLoading = true;
  cityNameFontSize: string;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {
    this.weatherResponse = new WeatherResponse();
    this.weatherResponse.weather = new Weather();
    this.weatherResponse.weather.description = 'rain';
    this.weatherResponse.weather.icon = '';
    this.weatherResponse.weather.tempMax = undefined;
    this.weatherResponse.weather.tempMin = undefined;
    this.weatherResponse.weather.temp = undefined;

    setInterval(() => {
      this.updateWeather();
    }, 1000 * 60 * 30);

  }

  ngOnChanges(): void {
    if (this.city !== undefined && this.cityShort !== undefined) {
      this.updateWeather();
    }
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
      .subscribe(r => {
        this.weatherResponse = r;
        this.notifyCoord.emit(this.weatherResponse.coord);
      });

    // call updateDailyWeather for the first time
    // if (this.dailyWeatherResponse === undefined) {
    //   weatherResponse$.subscribe(r => {
    //     this.updateDailyWeather(r.coord);
    //   });
    // }

  }
}
