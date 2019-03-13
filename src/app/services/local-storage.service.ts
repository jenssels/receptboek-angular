import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private recepten = [];
  constructor() {
    this.receptenOphalen();
  }

  // Jens Sels - Ophalen van alle recepten uit de local storage
  receptenOphalen() {
    if (localStorage.getItem('recepten')) {
      this.recepten = JSON.parse(localStorage.getItem('recepten'));
    }
    console.log(this.recepten);
    return this.recepten;
  }

  // Jens Sels - Recepten opslagen in de local storage
  receptenOpslagen() {
    localStorage.setItem('recepten', JSON.stringify(this.recepten));
    return this.receptenOphalen();
  }

  // Jens Sels - Recept toevoegen en opslagen in de localstorage
  receptToevoegen(recept: any) {
    this.recepten.push(recept);
    this.receptenOpslagen();
  }

  // Jens Sels - Recept verwijderen uit local storage
  receptVerwijderen(index: number) {
    this.recepten.splice(index, 1);
    this.receptenOpslagen();
  }
}
