import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Coord} from '../../model/weather/coord';
import {finalize} from 'rxjs/operators';
import {DailyWeatherResponse} from '../../model/weather/daily-weather-response';
import {WeatherService} from '../weather.service';

@Component({
  selector: 'app-weather-seven-day-table',
  templateUrl: './weather-seven-day-table.component.html',
  styleUrls: ['./weather-seven-day-table.component.css']
})
export class WeatherSevenDayTableComponent implements OnInit, OnChanges {

  @Input() city: string;
  @Input() coord: Coord;

  dailyWeatherResponse: DailyWeatherResponse;
  dailyWeatherResponseLoading = true;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {
    setInterval(() => {
      this.updateDailyWeather(this.coord);
    }, 1000 * 60 * 60);
  }

  ngOnChanges(): void {
    if(this.coord !== undefined) {
      this.updateDailyWeather(this.coord);
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
