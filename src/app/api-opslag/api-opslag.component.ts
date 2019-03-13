import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from '../services/local-storage.service';

@Component({
  selector: 'app-api-opslag',
  templateUrl: './api-opslag.component.html',
  styles: []
})
export class ApiOpslagComponent implements OnInit {

  recepten = [];

  constructor(private storage: LocalStorageService) { }

  ngOnInit() {
    this.getRecepten();
  }

  // Jens Sels - Calorieën per persoon berekenen
  getCalories(total, aantal) {
    let calories = 0;
    if (parseInt(total, 10) && parseInt(aantal, 10)) {
      calories = Math.round(parseInt(total, 10) / parseInt(aantal, 10));
    }
    return calories;
  }

  // Jens Sels - Ophalen van alle recepten uit local storage
  getRecepten() {
    this.recepten = this.storage.receptenOphalen();
  }

  // Jens Sels - Verwijderen van recept uit local storage
  deleteRecept(index: number) {
    this.storage.receptVerwijderen(index);
    this.getRecepten();
    alert('Recept verwijderd van apparaat!');
  }

}
