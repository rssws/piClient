import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherSevenDayTableComponent } from './weather-seven-day-table.component';

describe('WeatherSevenDayTableComponent', () => {
  let component: WeatherSevenDayTableComponent;
  let fixture: ComponentFixture<WeatherSevenDayTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeatherSevenDayTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherSevenDayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
