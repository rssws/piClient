import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {Coord} from '../../model/weather/coord';
import {HourlyWeatherResponse} from '../../model/weather/hourly-weather-response';
import {WeatherService} from '../weather.service';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {BaseChartDirective, Color, Label} from 'ng2-charts';
import {finalize} from 'rxjs/operators';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-weather-hourly-chart',
  templateUrl: './weather-hourly-chart.component.html',
  styleUrls: ['./weather-hourly-chart.component.css']
})
export class WeatherHourlyChartComponent implements OnInit, OnChanges {

  @Input() city: string;
  @Input() coord: Coord;
  @Input() dataLength = 24;

  hourlyWeatherResponse: HourlyWeatherResponse;
  hourlyWeatherResponseLoading = true;

  constructor(
    private weatherService: WeatherService
  ) { }

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[];
  public lineChartOptions: (ChartOptions) = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      labels: { fontColor: 'white' }
    },
    scales: {
      xAxes: [{
        ticks: {
          fontColor: 'white',
          fontSize: 11,
          stepSize: 1,
        },
        gridLines: { color: 'rgba(255,255,255,0.1)' }
      }],
      yAxes: [{
        ticks: {
          // There is no precision attribute in ng2-charts but in Chart.js. So ignore the warning.
          // @ts-ignore
          precision: 0,
          beginAtZero: true,
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
        right: 15,
        top: 0,
        bottom: 15
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
        image.src = this.images[index];
        ctx.drawImage(image, x - 9, yAxis.bottom + 25, 20, 20);
      });
    }
  }];

  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(63,165,255,0.2)',
      borderColor: 'rgba(63,165,255,1)',
      pointBackgroundColor: 'rgba(63,165,255,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(63,165,255,1)'
    },
    // {
    //   backgroundColor: 'rgba(205,229,255,0.2)',
    //   borderColor: 'rgb(205,229,255)',
    //   pointBackgroundColor: 'rgba(205,229,255,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(205,229,255,1)'
    // },
  ];
  public lineChartLegend = false;
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  ngOnInit(): void {
    setInterval(() => {
      this.updateHourlyWeather(this.coord);
    }, 1000 * 60 * 60);
  }

  ngOnChanges(): void {
    if (this.coord !== undefined) {
      this.updateHourlyWeather(this.coord);
    }
  }

  updateHourlyWeather(coord: Coord): void {
    this.hourlyWeatherResponseLoading = true;
    const hourlyWeatherResponse$ = this.weatherService.getHourlyWeatherResponseByCoord(coord);
    hourlyWeatherResponse$
      .pipe(finalize(() => this.hourlyWeatherResponseLoading = false))
      .subscribe(r => {
        this.hourlyWeatherResponse = r;
        const weathers = r.hourlyWeather.weathers.slice(0, this.dataLength);
        const temp: ChartDataSets = { data: [], label: 'current' };
        temp.data = weathers.map(weather => {
          return parseFloat((weather.temp - 273.15).toFixed(1));
        });
        this.lineChartLabels = weathers.map((weather, index) => {
          if (index === 0) {
            return 'now';
          }
          return new DatePipe('en-US').transform(weather.dt * 1000 , 'H');
        });

        this.images = weathers.map(weather => {
          return 'https://openweathermap.org/img/wn/' + weather.icon + '.png';
        });
        this.lineChartData.push(temp);
      });
  }
}
