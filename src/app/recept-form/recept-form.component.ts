import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ReceptService} from '../services/recept.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Gebruiker} from '../interfaces/gebruiker';
import {GebruikerService} from '../services/gebruiker.service';

@Component({
  selector: 'app-recept-form',
  templateUrl: './recept-form.component.html',
  styles: []
})
export class ReceptFormComponent implements OnInit {

  title = 'Recept aanmaken';

  constructor(private afs: AngularFirestore, private receptService: ReceptService,
              private route: ActivatedRoute, private gebruikerService: GebruikerService, private router: Router) { }

  currentThumbnail = '';
  loading = true;

  user: Gebruiker;

  Recept = {
    UID: '',
    naam: '',
    aantalPersonen: '',
    benodigdeTijd: '',
    beschrijving: '',
    bereiding: '',
    isPubliek: '',
    ingredienten: [],
    thumbnail: '',
    userUID: ''
  };

  ngOnInit() {
    this.route.queryParams.subscribe( params => {
      const id = params['id'] || 0;
      if (id !== 0) {
        this.receptService.getRecept(id).subscribe(result => {
          if (result != null) {
            this.Recept = this.receptService.setReceptData(result);
            this.title = 'Recept: "' + this.Recept.naam + '" bewerken';
            this.currentThumbnail = this.Recept.thumbnail;
          }
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
      }
    );

    this.gebruikerService.userData$.subscribe(data => this.user = data);
  }

  // Jens Sels - Voeg een leeg ingredient toe aan recept
  addIngredient() {
    this.Recept.ingredienten.push({naam: '', hoeveelheid: ''});
  }

  // Jens Sels - Verwijder ingredient
  removeIngredient(index: number) {
    this.Recept.ingredienten.splice(index, 1);
  }

  // Jens Sels - openen van storage op device om foto toe te voegen
  galerijFoto(event: any) {
    const reader = new FileReader();
    const that = this;

    reader.onload = function(e) {
      that.Recept.thumbnail = e.target.result;
    };

    if (event.target.files[0] != null) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  // Jens Sels - aanmaken of bewerken van het recept indien het formulier valid is
  gegevensOpslagen(valid: any) {
    if (valid) {
      if (this.Recept.UID === '') {
        this.Recept.userUID = this.user.uid;
        this.receptService.createRecept(this.Recept).then()
          .then(data => this.router.navigate(['receptDetail'], { queryParams: { id: data } }));
      } else {
        this.receptService.updateRecept(this.Recept, this.currentThumbnail)
          .then(() => this.router.navigate(['receptDetail'], { queryParams: { id: this.Recept.UID }}));
      }
    }
  }
}
