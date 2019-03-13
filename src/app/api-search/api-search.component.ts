import { Component, OnInit } from '@angular/core';
import {APIService} from '../services/api.service';
import {LocalStorageService} from '../services/local-storage.service';

@Component({
  selector: 'app-api-search',
  templateUrl: './api-search.component.html',
  styles: []
})
export class ApiSearchComponent implements OnInit {

  zoekString = '';
  recepten = [];
  from = 0;

  constructor(private api: APIService, private storage: LocalStorageService) { }

  ngOnInit() {
  }

  // Jens Sels - Parameters reset en recepten ophalen
  zoekRecepten() {
    if (this.zoekString !== '') {
      this.from = 0;
      this.getRecepten();
    }
  }

  // Jens Sels - Ophalen van recepten van de API
  getRecepten() {
    this.recepten = [];
    this.api.getRecipes$(this.zoekString, this.from).subscribe(data => {
      data.hits.forEach(value => {
        this.recepten.push(this.api.setAPIRecept(value.recipe));
      });
      console.log(this.recepten);
    });
  }

  // Jens Sels - Calorieën per persoon berekenen
  getCalories(total, aantal) {
    let calories = 0;
    if (parseInt(total, 10) && parseInt(aantal, 10)) {
      calories = Math.round(parseInt(total, 10) / parseInt(aantal, 10));
    }
    return calories;
  }

  // Jens Sels - Volgende 10 recepten ophalen
  increment() {
    this.from += 10;
    this.getRecepten();
  }

  // Jens Sels - Vorige 10 recepten ophalen
  decrement() {
    if (this.from - 10 >= 0) {
      this.from -= 10;
      this.getRecepten();
    }
  }

  // Jens Sels - Recept opslagen in localstorage
  saveRecept(index: number) {
    if (this.recepten[index]) {
      this.storage.receptToevoegen(this.recepten[index]);
      alert('Recept opgeslagen!');
    } else {
      alert('Recept niet opgeslagen !!!!');
    }
  }

}
