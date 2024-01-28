import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';

// Describe
describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  //Testbed
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Make sure that there are no outstanding requests.
  });

  // Test for getWeatherDataForRange method
  it('should fetch weather data for 30 days', () => {
    const mockResponse = {}; // Replace with expected mock response
    const dateFrom = '2024-01-01';
    const dateTo = '2024-01-30';

    service.getWeatherDataForRange(dateFrom, dateTo).then((response:any) => {
      expect(response.length).toBe(30); // Expect 30 days of data
      expect(response).toEqual(new Array(30).fill(mockResponse)); // Expect mock response for each day
    });

    const requests = httpMock.match((req) => req.url.includes(service.apiUrl));
    expect(requests.length).toBe(30); // Expect 30 requests to be made

    requests.forEach(request => {
      expect(request.request.method).toBe('GET');
      request.flush(mockResponse); // Mock the response
    });
  });

    // Test for formatDate method
    it('should format a date object to YYYY-MM-DD format', () => {
        const testDate = new Date('2024-01-15');
        const formattedDate = service['formatDate'](testDate); // Accessing private method
        expect(formattedDate).toBe('2024-01-15');
      });
    
      // Test for getDatesInRange method
      it('should generate an array of dates within a given range', () => {
        const startDate = '2024-01-01';
        const endDate = '2024-01-30';
        const dateRange = service['getDatesInRange'](startDate, endDate); // Accessing private method
    
        expect(dateRange.length).toBe(30);
        expect(dateRange[0]).toEqual(new Date('2024-01-01'));
        expect(dateRange[29]).toEqual(new Date('2024-01-30'));
      });
    

});
