import {Component, OnInit, ViewChild} from '@angular/core';
import {ReceptService} from '../services/recept.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Recept} from '../interfaces/recept';
import {User} from '../interfaces/user';
import {GebruikerService} from '../services/gebruiker.service';
import {Gebruiker} from '../interfaces/gebruiker';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ShareService} from '../services/share.service';
import {GebruikerInfo} from '../interfaces/gebruiker-info';
@Component({
  selector: 'app-recept-detail',
  templateUrl: './recept-detail.component.html',
  styles: []
})
export class ReceptDetailComponent implements OnInit {

  loading = true;
  recept: Recept;
  auteur: GebruikerInfo;
  gebruiker: Gebruiker;
  sharedUsers = [];
  selectedUser: any;
  users = [];
  zoekNaam = '';
  deleted = false;

  @ViewChild('content') private modal;
  @ViewChild('detail') private modalDetail;

  constructor(private receptService: ReceptService, private router: Router,
              private route: ActivatedRoute, private gebruikerService: GebruikerService,
              private modalService: NgbModal, private shareService: ShareService) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe( params => {
        const id = params['id'] || 0;
        if (id !== 0) {
          this.receptService.getRecept(id).subscribe(result => {
            if (result != null) {
              this.recept = this.receptService.setReceptData(result);
              this.gebruikerService.getUser(this.recept.userUID).subscribe(data => this.auteur = this.gebruikerService.setGebruikerInfo(data));
              this.getSharedUsers();
              this.loading = false;
            } else {
              this.router.navigate(['home']);
            }
          });
        } else {
          this.router.navigate(['home']);
        }
      }
    );
    this.gebruikerService.userData$.subscribe(data => this.gebruiker = data);
  }

  // Jens Sels - Ophalen van alle users die toegang hebben tot het recept
  getSharedUsers() {
    this.shareService.getSharedUsersForRecept(this.recept.UID).subscribe(data => {
      this.sharedUsers = data;
      this.sharedUsers.forEach(value => {
        this.gebruikerService.getUser(value.userUID).subscribe(user => {
          if (user != null) {
            value.user = user;
          }
        });
      });
    });
  }

  // Jens Sels - checkt of de ingelogde gebruiker de eigenaar is van het recept
  isOwner() {
      return this.gebruiker.uid === this.recept.userUID;
  }

  // Jens Sels - Openen van bewerk pagina als het recept van de ingelogde gebruiker is
  openBewerkPagina() {
    if (this.isOwner() || this.gebruiker.isAdmin === true) {
      this.router.navigate(['receptFormulier'], { queryParams: { id: this.recept.UID } });
    }
  }

  // Jens Sels - Openen van delete bevestig
  openDeleteModal() {
    if (this.isOwner() || this.gebruiker.isAdmin === true) {
      this.deleted = false;
      this.modalService.open(this.modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        console.log(`Closed with: ${result}`);
      }, (reason) => {
        console.log(reason);
      });
    }
  }

  // Jens Sels - Recept verwijderen
  deleteRecept() {
    if (this.isOwner() || this.gebruiker.isAdmin === true) {
      this.receptService.deleteRecept(this.recept.UID).then(() => {
        this.deleted = true;
        this.modal.close();
        this.router.navigate(['home']);
      });
    }
  }
  // Jens Sels - Ophalen van alle users afhankelijk van zoek criteria
  userZoeken() {
    this.gebruikerService.getAllUsers().subscribe(users => {
      this.users = [];
      if (users != null) {
        users.forEach(value => {
          if ((value.gebruikersnaam.toLowerCase().includes(this.zoekNaam.toLowerCase()) || this.zoekNaam === '') &&
            value.uid !== this.gebruiker.uid && !this.itemIdinArray(value.uid, this.sharedUsers)) {
            this.users.push(value);
          }
        });
      }
    });
  }

  // Jens Sels - Recept delen for user
  shareUser(index) {
    this.shareService.shareReceptForUser(this.recept.UID, this.users[index].uid).then(() => this.getSharedUsers());
    this.users.splice(index, 1);
  }

  // Jens Sels - Recept toegang verwijderen voor een user
  unshareUser(index) {
    this.shareService.unshareRecept(this.sharedUsers[index].UID).then(() => this.getSharedUsers());
  }

  // Jens Sels - Nakijken of de user in de sharedUser array zit
  itemIdinArray(uid, array) {
    let found = false;
    array.forEach(sharedUser => {
      if (uid === sharedUser.user.uid) {
        found = true;
      }
    });
    return found;
  }

  // Jens Sels - Openen van user detail
  openUserDetail(index: any) {
    if (this.users[index]) {
      this.selectedUser = this.users[index];
      console.log(this.selectedUser);
      this.modalService.open(this.modalDetail, {ariaLabelledBy: 'modal-basic-title2'}).result.then((result) => {
        console.log(`Closed with: ${result}`);
      }, (reason) => {
        console.log(reason);
      });
    }
  }

  // Jens Sels - Openen van user detail
  openSharedUserDetail(index: any) {
    if (this.sharedUsers[index]) {
      this.selectedUser = this.sharedUsers[index].user;
      console.log(this.selectedUser);
      this.modalService.open(this.modalDetail, {ariaLabelledBy: 'modal-basic-title2'}).result.then((result) => {
        console.log(`Closed with: ${result}`);
      }, (reason) => {
        console.log(reason);
      });
    }
  }

  openAuteurPagina(auteurUID: any) {
    this.router.navigate(['accountDetail'], { queryParams: { id: auteurUID }});
  }
}
