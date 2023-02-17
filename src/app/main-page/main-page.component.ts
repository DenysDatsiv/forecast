import { WeatherType, Coord } from './../interfaces/weather';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../services/validation.service';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, AfterViewInit {

  weatherData: WeatherType[] = JSON.parse(localStorage.getItem("forecast")) || [];
  searchedFirstFiveElements: WeatherType[];
  currentTime: any = new Date();
  five_sec_timer: number = 5000;
  searchCityForm: FormGroup;
  data: string = null;
  error: string = null;
  constructor(private weatherService: WeatherService,
    private validationService: ValidationService,
    private changeDetector: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.firstFiveElementSlicer()
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.searchCityForm = new FormGroup({
      'city': new FormControl("",
        [
          Validators.required,
          this.validationService.noSpaceAllowed,
          this.validationService.firstLetterCapital
        ])
    });
  }

  private getWeatherData(SearchedCity: string) {
    const exists = this.weatherData.findIndex(
      (infoAbout) => infoAbout.name === SearchedCity &&
        (infoAbout.timeOfSubmit - this.currentTime) > this.five_sec_timer);

    this.weatherService.getWeatherInfo(SearchedCity).subscribe(
      (item: WeatherType) => {
        if (exists > -1) {
          this.weatherData.splice(exists, 1)
        }

        if (this.weatherData.findIndex((element) => element.name === SearchedCity) === -1 && this.searchCityForm.valid) {
          this.weatherData.unshift({ ...item, timeOfSubmit: this.currentTime, })
          localStorage.setItem("forecast", JSON.stringify(this.weatherData));
        }

        this.firstFiveElementSlicer()
      },
      (errorMessage) => {
        console.log()
        this.error = errorMessage
      }
    )
  }
  firstFiveElementSlicer() {
    this.searchedFirstFiveElements = this.weatherData.slice(0, 5);
  }

  onSubmit() {
    const value = this.searchCityForm.value.city;
    this.getWeatherData(value);
    this.error = null;
  }

}