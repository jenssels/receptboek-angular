import { Component, OnInit } from '@angular/core';
import {GebruikerService} from '../services/gebruiker.service';
import {Gebruiker} from '../interfaces/gebruiker';

@Component({
  selector: 'app-recept-lijst',
  templateUrl: './recept-lijst.component.html',
  styles: []
})
export class ReceptLijstComponent implements OnInit {

  gebruiker: Gebruiker;

  constructor(private gebruikerService: GebruikerService) { }

  ngOnInit() {
    this.gebruikerService.userData$.subscribe(user => this.gebruiker = user);
  }

}
