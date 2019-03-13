import {Component, Input, OnInit} from '@angular/core';
import {ReceptService} from '../services/recept.service';
import {Router} from '@angular/router';
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import {ShareService} from '../services/share.service';
import {GebruikerService} from '../services/gebruiker.service';
import {Gebruiker} from '../interfaces/gebruiker';

@Component({
  selector: 'app-recept-render',
  templateUrl: './recept-render.component.html',
  styles: []
})
export class ReceptRenderComponent implements OnInit {

  @Input() mode = '';
  @Input() min = 4;
  @Input() increment = 4;
  @Input() max = 20;
  @Input() forId = '';
  @Input() gebruikerId = '';
  @Input() showIncrement = true;
  @Input() clickEnabled = true;
  @Input() headerTitle = 'Recepten';
  @Input() zoekEnabled = false;

  recepten = [];
  currentLimit = 0;
  zoekNaam = '';
  zoekTijd: number;
  zoekTijdOperator: WhereFilterOp = '==';
  gebruiker: Gebruiker;


  constructor(private receptService: ReceptService, private router: Router, private shareService: ShareService) { }

  ngOnInit() {
    this.currentLimit = this.min;
    this.getRecepten();
  }

  // Jens Sels - Ophalen van alle recepten afhankelijk van de input
  getRecepten() {
    switch (this.mode) {
      case 'auteur':
        this.getReceptenFromAuteur();
        break;
      case 'auteurPubliek':
        this.getPubliekeReceptenFromAuteur();
        break;
      case 'share':
        this.getSharedReceptenForUser();
        break;
      case 'shareAuteur':
        this.getSharedReceptenForUserFromAuteur();
        break;
      default:
        this.getPubliekeRecepten();
        break;
    }

  }

  // Jens Sels - Ophalen van alle recepten van een bepaalde auteur
  getReceptenFromAuteur() {
      if (this.forId != null) {
        this.receptService.getReceptenWhereLimit(this.currentLimit, 'userUID', this.forId , undefined)
          .subscribe(data => this.recepten = data);
      }
  }

  // Jens Sels - Ophalen van alle publieke recepten van een bepaalde auteur
  getPubliekeReceptenFromAuteur() {
    if (this.forId != null) {
      this.receptService.getRecepten('userUID', this.forId , undefined)
        .subscribe(data => {
          this.recepten = [];
          let teller = 0;
          data.forEach(value => {
            if (value.isPubliek === true && teller < this.currentLimit) {
              this.recepten.push(value);
              teller++;
            }
          });
        });
    }
  }

  // Jens Sels - Ophalen van alle publieke recepten
  getPubliekeRecepten() {
    this.receptService.getReceptenWhereLimit(this.currentLimit, 'isPubliek', true, undefined)
      .subscribe(data => this.recepten = data);
  }

  // Jens Sels - Meer recepten tonen
  incrementLimit() {
    if (this.showIncrement === true) {
      this.currentLimit += this.increment;
      this.getRecepten();
    }
  }

  // Jens Sels - Minder recepten tonen
  decrementLimit() {
    if (this.showIncrement === true) {
      if (this.currentLimit - this.increment <= this.min) {
        this.currentLimit = this.min;
      } else {
        this.currentLimit -= this.increment;
      }
      this.getRecepten();
    }
  }

  // Jens Sels - Openen van de detail pagina van een recept
  openDetail(receptUID: string) {
    if (this.clickEnabled === true) {
      this.router.navigate(['receptDetail'], { queryParams: { id: receptUID }});
    }
  }

  // Jens Sels - Zoeken naar recepten afhankelijk van zoek criteria
  zoeken() {
    if (this.zoekEnabled === true) {
      this.receptService.getReceptenWhereZoek(this.zoekTijd || 0,
        this.zoekTijdOperator).subscribe(recepten => {
          this.recepten = [];
          let teller = 0;
          recepten.forEach((recept) => {
            if (((recept.naam.toLowerCase().includes(this.zoekNaam.toLowerCase()) || this.zoekNaam === '') && recept.isPubliek === true)
              && teller < this.currentLimit) {
              this.recepten.push(recept);
              teller++;
            }
        });
      });
    }
  }

  // Jens Sels - Ophalen van alle recepten die gedeeld zijn voor een gebruiker
  getSharedReceptenForUser() {
    if (this.gebruikerId != null) {
      this.shareService.getSharedReceptenForUser(this.gebruikerId).subscribe(data => {
        let teller = 0;
        this.recepten = [];
        data.forEach((value) => {
          this.receptService.getRecept(value.receptUID).subscribe(recept => {
            if (recept['isPubliek'] !== true && teller < this.currentLimit) {
              this.recepten.push(recept);
              teller++;
            }
          });
        });
      });
    }
  }

  // Jens Sels - Ophalen van alle recepten die gedeeld zijn voor een gebruiker van een bepaalde auteur
  getSharedReceptenForUserFromAuteur() {
    if (this.forId != null && this.gebruikerId != null) {
      this.shareService.getSharedReceptenForUser(this.gebruikerId).subscribe(data => {
        let teller = 0;
        this.recepten = [];
        data.forEach((value) => {
          this.receptService.getRecept(value.receptUID).subscribe(recept => {
            if (recept['isPubliek'] !== true && teller < this.currentLimit && recept['userUID'] === this.forId) {
              this.recepten.push(recept);
              teller++;
            }
          });
        });
      });
    }
  }

}
