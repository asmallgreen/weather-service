// src/app/app.integration.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { App } from './main'; // Adjust the import path as necessary
import { ChartComponent } from './components/chart.component';
import { WeatherService } from './services/weather.service';

// Describe
describe('App Component Integration Tests', () => {
  let appComponent: App;
  let fixture: ComponentFixture<App>;
  let weatherService: WeatherService;
  let httpTestingController: HttpTestingController;

  // Testbed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        ChartComponent, 
        App // Import App as a standalone component
      ],
      providers: [WeatherService]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    appComponent = fixture.componentInstance;
    weatherService = TestBed.inject(WeatherService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  // Test for HTTP requests
  it('should make HTTP requests for each day', () => {
    const dateFrom = '2023-12-01';
    const dateTo = '2023-12-30';

    weatherService.getWeatherDataForRange(dateFrom, dateTo);
  
    let currentDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
  
    while (currentDate <= endDate) {
      const formattedDateStr = weatherService.formatDate(currentDate);
      const expectedUrl = `${weatherService.apiUrl}?date_time=${formattedDateStr}T00:00:00`;
  
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush({/* Mock response data */});
  
      currentDate.setDate(currentDate.getDate() + 1);
    }

    httpTestingController.verify();
  });

});
