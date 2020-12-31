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
  @Input() weatherResponse: WeatherResponse;
  @Input() city: string;
  @Input() cityShort: string;
  @Output() notifyCoord: EventEmitter<Coord> = new EventEmitter<Coord>();
  @Output() notifyWeatherResponse: EventEmitter<WeatherResponse> = new EventEmitter<WeatherResponse>();

  weatherResponseLoading = true;
  cityNameFontSize: string;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.weatherResponse !== undefined) {
      this.prepareFont();
      this.weatherResponseLoading = false;
    } else if (this.city !== undefined) {
      this.updateWeather();
    }
  }

  updateWeather(): void {
    this.weatherResponseLoading = true;

    const weatherResponse$ = this.weatherService.getWeatherResponseByCity(this.city);
    weatherResponse$
      .pipe(finalize(() => this.weatherResponseLoading = false))
      .subscribe(r => {
        this.weatherResponse = r;
        this.notifyCoord.emit(this.weatherResponse.coord);
        this.notifyWeatherResponse.emit(this.weatherResponse);
        this.prepareFont();
      });
  }

  prepareFont(): void {
    if (this.city.length > 12) {
      this.cityNameFontSize = '6vw';
    } else if (this.city.length > 7) {
      this.cityNameFontSize = '8vw';
    } else {
      this.cityNameFontSize = '10vw';
    }
  }
}
