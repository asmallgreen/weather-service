import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import * as Highcharts from 'highcharts';

// 1. Describe
describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  // Testbed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent] // Import the standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // It
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Highcharts 配置
  it('should have correct initial Highcharts configuration', () => {
    expect(component.chartOptions.chart?.type).toBe('spline');
    expect(component.Highcharts).toEqual(Highcharts);
  });

  // Update bews data
  it('should update chart with new data', () => {
    const mockData = [
      { date: '2024-01-01', valueHigh: 33, valueLow: 30 },
      { date: '2024-01-02', valueHigh: 32, valueLow: 28 }
    ];
    const title = 'Test Chart';

    spyOn(Highcharts, 'chart');

    component.updateChart(title, mockData);

    // 資料型別
    const series = component.chartOptions.series as Highcharts.SeriesLineOptions[];
    expect(component.chartOptions.title?.text).toBe(title);
    expect(series[0]?.data).toEqual(mockData.map(d => [d.date, d.valueHigh]));
    expect(series[1]?.data).toEqual(mockData.map(d => [d.date, d.valueLow]));
    expect(Highcharts.chart).toHaveBeenCalled();
  });

});
