import { Component, OnInit } from '@angular/core';
import {GebruikerService} from '../services/gebruiker.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Gebruiker} from '../interfaces/gebruiker';
import {User} from '../interfaces/user';
import {GebruikerInfo} from '../interfaces/gebruiker-info';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styles: []
})
export class AccountDetailComponent implements OnInit {
  gebruiker: Gebruiker;
  auteur: GebruikerInfo;

  constructor(private router: Router,
              private route: ActivatedRoute, private gebruikerService: GebruikerService) { }

  ngOnInit() {
    this.route.queryParams.subscribe( params => {
        const id = params['id'] || 0;
        if (id !== 0) {
          this.gebruikerService.getUser(id).subscribe(data => this.auteur = this.gebruikerService.setGebruikerInfo(data));
        } else {
          this.router.navigate(['home']);
        }
      }
    );
    this.gebruikerService.userData$.subscribe(data => this.gebruiker = data);
  }

}
