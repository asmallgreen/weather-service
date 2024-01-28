import { Component, ViewChild } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';

import { WeatherService } from './services/weather.service';
import { ChartComponent } from './components/chart.component';

import 'zone.js';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [HttpClient, WeatherService],
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ChartComponent,
    AgGridModule,
  ],
})
export class App {
  @ViewChild('temperatureChart') temperatureChartComponent!: ChartComponent;
  @ViewChild('humidityChart') humidityChartComponent!: ChartComponent;

  title = 'Weather Service';
  // dateTo: string = '2024-01-13';
  today = new Date();
  dateTo: string = this.today.toISOString().split('T')[0];
  maxDate: string = this.today.toISOString().split('T')[0];
  // dateToString: string;

  
  constructor(private weatherService: WeatherService) {

  }
  
  // 第一次渲染就先讓日期選擇器為當天日期
  ngOnInit(){
    // const today = new Date();
    // this.dateToString = today.toISOString().split('T')[0]
    this.getWeather()
  }

  columnDefs = [
    { field: 'date', headerName: 'Date' },
    { field: 'temperatureHigh', headerName: 'Temperature(H)' },
    { field: 'temperatureLow', headerName: 'Temperature(L)' },
    { field: 'humidityHigh', headerName: 'Humidity(H)' },
    { field: 'humidityLow', headerName: 'Humidity(L)' },
  ];

  // 用來放所有的rowData，要先宣吿型別
  tableData: any[] = [];

  async getWeather(){
    try{
      const dateFrom = new Date(this.dateTo)
      dateFrom.setDate(dateFrom.getDate() - 29);
      const formattedDateFrom = this.weatherService.formatDate(dateFrom);
      
      const weatherDataList = await this.weatherService.getWeatherDataForRange(
        formattedDateFrom,
        this.dateTo
        // this.dateToString
      );
        console.log('weatherDataList:',weatherDataList)

      // 一個儲存溫度，一個儲存濕度
      const dailyTemperatureData: any = [];
      const dailyHumidityData: any = [];

      // 用來存所有溫濕度數據
      this.tableData = [];
      
      weatherDataList.forEach((n)=>{
        const high =
          n.items[0].general !== undefined &&
          n.items[0].periods[0].time.start.toUpperCase() != 'INVALID DATE'
            ? n.items[0].general.temperature.high
            : -1;

            if (high != -1) {
              const dateStart = new Date(n.items[0].periods[0].time.start);
              const formatDateStart = this.weatherService.formatDate(dateStart);

          let rowData = {
            date: formatDateStart,
            temperatureHigh: null,
            temperatureLow: null,
            humidityHigh: null,
            humidityLow: null,
          };

          if (!dailyTemperatureData[formatDateStart]) {
            dailyTemperatureData[formatDateStart] = {
              date: formatDateStart,
              valueHigh: n.items[0].general.temperature.high,
              valueLow: n.items[0].general.temperature.low,
            };
            rowData = {
              ...rowData,
              temperatureHigh: n.items[0].general.temperature.high,
              temperatureLow: n.items[0].general.temperature.low,
            };
          }

          if (!dailyHumidityData[formatDateStart]) {
            dailyHumidityData[formatDateStart] = {
              date: formatDateStart,
              valueHigh: n.items[0].general.relative_humidity.high,
              valueLow: n.items[0].general.relative_humidity.low,
            };
            rowData = {
              ...rowData,
              humidityHigh: n.items[0].general.relative_humidity.high,
              humidityLow: n.items[0].general.relative_humidity.low,
            };
          }
          console.log('rowData:', rowData);
          if (rowData.temperatureHigh != null) {
            this.tableData.push(rowData);
          }
        }

      });
      console.log('tableData:', this.tableData)

      // 重新確認一下日期排序
      this.tableData.sort((n) => n.date);

      if (this.temperatureChartComponent) {
        this.temperatureChartComponent.updateChart(
          'Temperature Trend',
          Object.values(dailyTemperatureData)
        );
      }

      if (this.humidityChartComponent) {
        this.humidityChartComponent.updateChart(
          'Humidity trend',
          Object.values(dailyHumidityData)
        );
      }




    } catch(error) {
      console.error('Error fetching weather data', error);
    }
  }
}

bootstrapApplication(App);
