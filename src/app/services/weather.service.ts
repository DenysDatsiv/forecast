import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) { }

  getWeatherInfo(cityName: string) {
    return new Observable((observer) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position)
        },
        (error) => {
          observer.error(error)
        })
    }).pipe(
      map((value: any) => {
        return new HttpParams()
          .set('q', cityName)
          .set('appid', 'cd36aa5a5e434fdb9f00c0f5a1eda7b3')
          .set('units', 'metric')
      }),
      switchMap((values) => {
        return this.http.get('https://api.openweathermap.org/data/2.5/weather', { params: values })
      })
    )
  }
}
