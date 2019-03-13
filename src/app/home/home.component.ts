import { Component, OnInit } from '@angular/core';
import {GebruikerService} from '../services/gebruiker.service';
import {Gebruiker} from '../interfaces/gebruiker';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  gebruiker: Gebruiker;

  constructor(private gebruikerService: GebruikerService) { }

  ngOnInit() {
    this.gebruikerService.userData$.subscribe(user => this.gebruiker = user);
  }

}
