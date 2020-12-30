import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { WeatherDefaultComponent } from './weather/weather-default/weather-default.component';
import { WeatherSevenDayTableComponent } from './weather/weather-seven-day-table/weather-seven-day-table.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    NavigationComponent,
    WeatherDefaultComponent,
    WeatherSevenDayTableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
