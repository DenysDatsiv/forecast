import { WeatherType } from './../interfaces/weather';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

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
      map((value: WeatherType) => {
        return new HttpParams()
          .set('q', cityName)
          .set('appid', 'cd36aa5a5e434fdb9f00c0f5a1eda7b3')
          .set('units', 'metric')
      }),
      switchMap((values) => {
        return this.http.get('https://api.openweathermap.org/data/2.5/weather', { params: values })
      }), catchError((error) => {
        let errorMessage = "Check vilidity";
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
            console.log("error Event")
          } else {
            switch (error.status) {
              case 400:
                errorMessage = "400 Bad Request"
              case 404:
                errorMessage = "City name is Incorrect"
                break
            }
          }
        }
        else {
          console.log("An error occured")
        }
        return throwError(errorMessage)
      })
    )
  }
}