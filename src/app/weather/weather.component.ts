import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Coord} from '../model/weather/coord';
import {WeatherService} from './weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  city = undefined;
  cityShort = undefined;
  coord = undefined;

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

    this.updateCityName();

    setInterval(() => {
      this.currentTimer += 1;
      if (this.currentTimer === 1000) {
        this.currentTimer = 0;
        this.currentPage = (this.currentPage + 1) % 3;
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
          this.city = jsonResponse.ipGeolocation.city + ', ' + jsonResponse.ipGeolocation.countryCode;
          this.cityShort = jsonResponse.ipGeolocation.city;
        }
    },
        error => {
        alert('Error: ' + error.name + '\nError Message: ' + error.message);
    });
  }

  setCoord(coord: Coord): void {
    this.coord = coord;
  }
}
