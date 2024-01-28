import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WeatherService {
  constructor(private http: HttpClient) {}
   apiUrl =
    'https://api.data.gov.sg/v1/environment/24-hour-weather-forecast';

    async getWeatherDataForRange(
      dateFrom: string,
      dateTo: string
    ): Promise<any[]> {
      // dates 為從選擇日過去30天的陣列
      const dates = this.getDatesInRange(dateFrom, dateTo);

      // 每一個日期都要取得一次Api的資料
      const results = dates.map((date) => {
        const formattedDateStr = this.formatDate(date);
        const apiFullUrl = `${this.apiUrl}?date_time=${formattedDateStr}T00:00:00`;
        return this.http.get(apiFullUrl).toPromise();
      });

      // 30天的資料都取完再一次回傳
      return Promise.all(results);
    }

      // 將日期格式化
      formatDate(dateParam: Date): string {
        const year = dateParam.getFullYear();
        const month = (dateParam.getMonth() + 1).toString().padStart(2, '0');
        const day = dateParam.getDate().toString().padStart(2, '0');
    
        return `${year}-${month}-${day}`;
      }

    // 取得起始日跟結束日後，將這之間的每一天填入陣列，以取得完整的30天陣列
    private getDatesInRange(startDate: string, endDate: string): Date[] {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dateArray: Date[] = [];
      let currentDate = start;
  
      while (currentDate <= end) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      return dateArray;
    }
}