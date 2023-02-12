import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../services/validation.service';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  weatherData: any = JSON.parse(localStorage.getItem("forecast")) || [];
  currentTime: any = new Date();
  searchCityForm: FormGroup;
  constructor(private weatherService: WeatherService, private validationService: ValidationService) { }

  ngOnInit(): void {
    this.searchCityForm = new FormGroup(
      {
        'city': new FormControl("", [Validators.required, this.validationService.noSpaceAllowed, this.validationService.firstLetterCapital])
      }
    );
  }

  private getWeatherData(SearchedCity: string) {
    const FIVE_SEC = 5 * 1000;
    const exists = this.weatherData.findIndex(
      infoAbout => infoAbout.name === SearchedCity &&
        (infoAbout.timeOfSubmit - this.currentTime) > FIVE_SEC);

    this.weatherService.getWeatherInfo(SearchedCity).subscribe(item => {
      if (exists > -1) {
        this.weatherData.splice(exists, 1)
      }

      if (this.weatherData.length >= 5) {
        this.weatherData.shift()
      }

      if (this.weatherData.findIndex(element => element.name === SearchedCity) === -1 && this.searchCityForm.valid) {
        this.weatherData.push({ ...item, timeOfSubmit: new Date() })
        localStorage.setItem("forecast", JSON.stringify(this.weatherData));
      }
    })
  }

  onSubmit() {
    const value = this.searchCityForm.value.city;
    this.getWeatherData(value);
  }

}