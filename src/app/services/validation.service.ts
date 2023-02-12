import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  noSpaceAllowed(input: FormControl) {
    if (input.value !== null && input.value.indexOf(' ') != -1) {
      return { noSpaceAllowed: true }
    }
    else {
      return null
    }
  }
  firstLetterCapital(input: FormControl) {
    if (input.value.charAt(0) === input.value.charAt(0).toLowerCase()) {
      return { firstLetterCapital: true }
    }
    else {
      return null
    }
  }
}
