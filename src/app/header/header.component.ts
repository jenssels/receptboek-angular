import { Component, OnInit } from '@angular/core';
import {GebruikerService} from '../services/gebruiker.service';
import {Gebruiker} from '../interfaces/gebruiker';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  isCollapsed = true;
  gebruiker: Gebruiker;

  constructor(public gebruikerService: GebruikerService) { }

  ngOnInit() {
    this.gebruikerService.userData$.subscribe(data => this.gebruiker = data);
  }

}
