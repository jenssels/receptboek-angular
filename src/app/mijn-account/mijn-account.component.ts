import {Component, OnInit, ViewChild} from '@angular/core';
import {Gebruiker} from '../interfaces/gebruiker';
import {GebruikerService} from '../services/gebruiker.service';
import {Observable, Subject} from 'rxjs';
import {AngularFirestore} from 'angularfire2/firestore';
import {WebcamImage} from 'ngx-webcam';
import {AngularFireStorage} from '@angular/fire/storage';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mijn-account',
  templateUrl: './mijn-account.component.html',
  styles: []
})
export class MijnAccountComponent implements OnInit {
  @ViewChild('uploadingModal') private uploadingModal;

  constructor(public gebruikerService: GebruikerService, private afs: AngularFirestore,
              private fireStorage: AngularFireStorage, private modalService: NgbModal) {
    this.gebruikerService.userData$.subscribe(data => {
      this.gebruiker = data;
    });
  }
  gebruiker: Gebruiker;
  editMode = false;
  fotoMode = false;
  uploading = false;
  uploadStatus = null;
  foto: any = null;

  public triggerFoto: Subject<void> = new Subject<void>();

  formData = {
    gebruikersnaam: '',
    beschrijving: ''
  };

  // Jens Sels - Configuratie die zegt of de foto van de webcam gespiegeld moet worden
  public isMirrored() {
    return 'never';
  }

  ngOnInit() {
  }

  // Jens Sels - Gegevens uit formulier ophalen en wegschrijven naar de gebruikersInfo van de huidige gebruiker
  gegevensWijzigen(valid: string, data: any) {
    if (valid) {
      this.afs.doc(`gebruikerInfo/${this.gebruiker.uid}`).update({gebruikersnaam: data.gebruikersnaam, beschrijving: data.beschrijving})
        .then(function() {
          console.log('Document successfully updated!');
        })
        .catch(function(error) {
          console.error('Error removing document: ', error);
        });
      this.editMode = false;
    }
  }

  // Jens Sels - Openen van sectie met webcam
  cameraFoto() {
    this.fotoMode = true;
  }

  // Jens Sels - Verwijderen van foto en fotoCode uit firestore en gebruikerInfo
  resetFoto() {
    const that = this;
    const opslagref = this.fireStorage.storage.ref();
    this.afs.doc(`gebruikerInfo/${this.gebruiker.uid}`).update({fotoCode: null})
      .then(function() {
        console.log('Document successfully updated!');
        opslagref.child(`profielFotos/${that.gebruiker.uid}`).delete().then(
          promise => console.log('Foto succesvol verwijderd')
        ).catch(error => console.log(error));
      })
      .catch(function(error) {
        console.error('Error removing document: ', error);
      });
  }

  // Jens Sels - Foto selecteren van device en deze uploaden naar de firestore
  galerijFoto(event: any) {
    const that = this;
    const foto = event.target.files[0];
    if (foto != null) {
      const opslagref = this.fireStorage.storage.ref();
      this.openUploadStatusModal();
      opslagref.child(`profielFotos/${this.gebruiker.uid}`).put(foto).then(
        function(result) {
          that.showStatus(true);
          result.ref.getDownloadURL().then(
            function(url) {
              that.afs.doc(`gebruikerInfo/${that.gebruiker.uid}`).update({fotoCode: url})
                .then(function() {
                  console.log('Document successfully updated!');
                  that.annulerenFoto() ;
                })
                .catch(function(error) {
                  console.error('Error removing document: ', error);
                });
            }
          );
        }
      ).catch(error => {
        console.log(error);
        this.showStatus(false);
      });
    }
  }

  // Jens Sels - Event van de webcam component die de foto opvangt die er getrokken word en slaagt de foto dan op in variable 'foto'
  public handleImage(webcamImage: WebcamImage): void {
    this.foto = webcamImage ;
  }

  // Jens Sels - Functie die een trigger stuurt naar de webcam component en die een foto laat trekken
  public triggerSnapshot(): void {
    this.triggerFoto.next();
  }

  // Jens Sels - Sluiten van foto sectie en foto op null zetten
  public annulerenFoto() {
    this.foto = null;
    this.fotoMode = false;
  }

  // Jens Sels - Foto opslagen in firestore van firebase en dan de url van de foto opslagen in de gebruikersInfo van de huidige gebruiker
  public opslaanFoto() {
    const that = this;
    const opslagref = this.fireStorage.storage.ref();
    that.openUploadStatusModal();
    opslagref.child(`profielFotos/${this.gebruiker.uid}`).putString(this.foto.imageAsDataUrl, 'data_url').then(
      function(result) {
        that.showStatus(true);
        result.ref.getDownloadURL().then(
          function(url) {
            that.afs.doc(`gebruikerInfo/${that.gebruiker.uid}`).update({fotoCode: url})
              .then(function() {
                console.log('Document successfully updated!');
                that.annulerenFoto() ;
              })
              .catch(function(error) {
                console.error('Error removing document: ', error);
              });
          }
        );
      }
    ).catch(error => {
      console.log(error);
      that.showStatus(false);
    });
  }

  openUploadStatusModal() {
    this.uploading = true;
    this.modalService.open(this.uploadingModal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.uploading = false;
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

  // Jens Sels - Toont message in de upload modal of de upload succesvol was
  showStatus(isSucces: boolean) {
    this.uploading = false;
    if (!isSucces) {
      this.uploadStatus = 'Upload mislukt';
    } else {
      this.uploadStatus = 'Upload succesvol';
    }
  }
}
