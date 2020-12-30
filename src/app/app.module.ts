import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { WeatherDefaultComponent } from './weather/weather-default/weather-default.component';
import { WeatherSevenDayTableComponent } from './weather/weather-seven-day-table/weather-seven-day-table.component';
import {ChartsModule} from 'ng2-charts';
import { WeatherSevenDayChartComponent } from './weather/weather-seven-day-chart/weather-seven-day-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    NavigationComponent,
    WeatherDefaultComponent,
    WeatherSevenDayTableComponent,
    WeatherSevenDayChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
