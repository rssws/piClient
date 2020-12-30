import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ChartData, ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import {Coord} from '../../model/weather/coord';
import {DailyWeatherResponse} from '../../model/weather/daily-weather-response';
import {WeatherService} from '../weather.service';
import {finalize} from 'rxjs/operators';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-weather-seven-day-chart',
  templateUrl: './weather-seven-day-chart.component.html',
  styleUrls: ['./weather-seven-day-chart.component.css']
})
export class WeatherSevenDayChartComponent implements OnInit, OnChanges {

  @Input() city: string;
  @Input() coord: Coord;

  dailyWeatherResponse: DailyWeatherResponse;
  dailyWeatherResponseLoading = true;

  constructor(
    private weatherService: WeatherService
  ) { }

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    legend: {
      labels: { fontColor: 'white' }
    },
    scales: {
      xAxes: [{
        ticks: { fontColor: 'white', fontSize: 15 },
        gridLines: { color: 'rgba(255,255,255,0.1)' }
      }],
      yAxes: [{
        ticks: {
          fontColor: 'white',
          fontSize: 20,
          callback: (value, index, values) => {
            return value + '°';
          }
        },
        gridLines: { color: 'rgba(255,255,255,0.1)' }
      }]
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 40
      }
    }
  };

  images: string[];
  public lineChartPlugins = [{
    afterDraw: chart => {
      const ctx = chart.chart.ctx;
      const xAxis = chart.scales['x-axis-0'];
      const yAxis = chart.scales['y-axis-0'];
      xAxis.ticks.forEach((value, index) => {
        const x = xAxis.getPixelForTick(index);
        const image = new Image();
        image.src = this.images[index],
          ctx.drawImage(image, x - 25, yAxis.bottom + 25);
      });
    }
  }];

  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(63,165,255,0.2)',
      borderColor: 'rgba(63,165,255,1)',
      pointBackgroundColor: 'rgba(63,165,255,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(63,165,255,1)'
    },
    { // dark grey
      backgroundColor: 'rgba(205,229,255,0.2)',
      borderColor: 'rgb(205,229,255)',
      pointBackgroundColor: 'rgba(205,229,255,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(205,229,255,1)'
    },
  ];
  public lineChartLegend = false;
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  ngOnInit(): void {
    setInterval(() => {
      this.updateDailyWeather(this.coord);
    }, 1000 * 60 * 60);
  }

  ngOnChanges(): void {
    if (this.coord !== undefined) {
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
        const tempMax: ChartDataSets = { data: [], label: 'max' };
        const tempMin: ChartDataSets = { data: [], label: 'min' };
        tempMax.data = r.dailyWeather.weathers.map(weather => {
          return parseFloat((weather.tempMax - 273.15).toFixed(1));
        });
        tempMin.data = r.dailyWeather.weathers.map(weather => {
          return parseFloat((weather.tempMin - 273.15).toFixed(1));
        });
        this.lineChartLabels = r.dailyWeather.weathers.map((weather, index) => {
          if (index === 0) {
            return 'Today';
          }
          return new DatePipe('en-US').transform(weather.dt * 1000 , 'E');
        });

        this.images = r.dailyWeather.weathers.map(weather => {
          return 'https://openweathermap.org/img/wn/' + weather.icon + '.png';
        });
        this.lineChartData.push(tempMin, tempMax);
      });
  }
}
