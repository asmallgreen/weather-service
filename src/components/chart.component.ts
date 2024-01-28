import { Component, AfterViewInit, Input, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<div></div>`,
})

export class ChartComponent implements AfterViewInit {

  @Input() chartId: string = '';

  Highcharts: typeof Highcharts = Highcharts; // Required for Highcharts
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'spline',
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'category',
      title: {
        text: 'Date',
      },
      categories: [],
    },
    yAxis: {
      title: {
        text: 'Value',
      },
    },
    series: [
      {
        name: 'High',
        type: 'spline',
        marker: {
          symbol: 'square',
        },
        data: [],
      },
      {
        name: 'Low',
        type: 'spline',
        marker: {
          symbol: 'circle',
        },
        data: [],
      },
    ],
  };
  constructor(private el: ElementRef) {}

  ngAfterViewInit(){
    const container = this.el.nativeElement.firstChild;
    container.id = this.chartId;
  }

  updateChart(
    title: string,
    data: { date: string, valueHigh: number, valueLow: number}[]
  ){
    if(this.chartOptions.series && this.chartOptions.series.length >= 2){
      const dataHighSeries = this.chartOptions
        .series[0] as Highcharts.SeriesLineOptions;
      const dataLowSeries = this.chartOptions
        .series[1] as Highcharts.SeriesLineOptions;

      if (dataHighSeries && dataLowSeries) {
        const categories = data.map((d) => {
          return d.date;
        });

        this.chartOptions.title = { text: title };

        this.chartOptions.xAxis = {
          type: 'category',
          categories: categories,
        };

        dataHighSeries.data = data.map((d) => [d.date, d.valueHigh]);
        dataLowSeries.data = data.map((d) => [d.date, d.valueLow]);

        Highcharts.chart(this.chartId, this.chartOptions);
      }
    }

  }
}