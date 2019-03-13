import { Injectable } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import {ShareService} from './share.service';

@Injectable({
  providedIn: 'root'
})
export class ReceptService {

  constructor(private router: Router, private afs: AngularFirestore, private fireStorage: AngularFireStorage, private shareService: ShareService) { }

  // Jens Sels - Uploaden van recept naar firebase
  createRecept(recept: any) {
    const receptUID = this.afs.createId();
    const that = this;

    return this.afs.doc(`recept/${receptUID}`)
      .set({UID: receptUID, naam: recept.naam, aantalPersonen: recept.aantalPersonen, benodigdeTijd: recept.benodigdeTijd,
        beschrijving: recept.beschrijving, bereiding: recept.bereiding, isPubliek: recept.isPubliek,
        ingredienten: recept.ingredienten, thumbnail: recept.thumbnail, toevoegingDatum: new Date(), userUID: recept.userUID})
      .then(
        () => {
          console.log('Recept successfully written!');
          if (recept.thumbnail !== '') {
            that.uploadThumbnail(receptUID, recept.thumbnail);
          }
          return receptUID;
        }
      ).catch(
      error => {
        console.error('Error writing recept: ', error);
      }
    );
  }

  // Jens Sels - updaten van recept
  updateRecept(recept: any, currentThumbnail: any) {
    const that = this;

    return this.afs.doc(`recept/${recept.UID}`)
      .update({naam: recept.naam, aantalPersonen: recept.aantalPersonen, benodigdeTijd: recept.benodigdeTijd,
        beschrijving: recept.beschrijving, bereiding: recept.bereiding, isPubliek: recept.isPubliek,
        ingredienten: recept.ingredienten, thumbnail: recept.thumbnail})
      .then(
        () => {
          console.log('Recept successfully updated!');
          if (recept.thumbnail !== currentThumbnail) {
            that.uploadThumbnail(recept.UID, recept.thumbnail);
          }
        }
      ).catch(
      error => {
        console.error('Error writing recept: ', error);
      }
    );
  }

  // Jens Sels - Upload thumbnail foto voor recept en update dan de thumbnailCode in het recept
  uploadThumbnail(UID: any, thumbnail: any) {
    const opslagref = this.fireStorage.storage.ref();
    const that = this;

    opslagref.child(`receptFotos/${UID}`).putString(thumbnail, 'data_url').then(
      function(result) {
        result.ref.getDownloadURL().then(
          function(url) {
            that.afs.doc(`recept/${UID}`).update({thumbnail: url})
              .then(function() {
                console.log('Recept thumbnail successfully updated!');
              })
              .catch(function(error) {
                console.error('Error updating recept thumbnail: ', error);
              });
          }
        );
      }
    ).catch(error => {
      console.log(error);
    });
  }

  getRecept(receptUID: any) {
    return this.afs.doc(`recept/${receptUID}`).valueChanges();
  }

  getRecepten(where: string, whereValue: any,
                 whereOperator: WhereFilterOp = '==') {
    return this.afs.collection<any>('recept',
      ref => ref.where(where, whereOperator, whereValue).orderBy('toevoegingDatum', 'desc')
    ).valueChanges();
  }

  getReceptenWhereLimit(limit: number, where: string, whereValue: any,
              whereOperator: WhereFilterOp = '==') {
    return this.afs.collection<any>('recept',
      ref => ref.where(where, whereOperator, whereValue).orderBy('toevoegingDatum', 'desc').limit(limit)
    ).valueChanges();
  }

  getReceptenWhereZoek(zoekTijd: number = 0, zoekTijdOperator: WhereFilterOp) {
    if (zoekTijd === 0) {
      zoekTijdOperator = '>=';
    }
    return this.afs.collection<any>('recept', ref =>
        ref.where('benodigdeTijd', zoekTijdOperator, zoekTijd).orderBy('toevoegingDatum', 'desc')
    ).valueChanges();
  }

  setReceptData(data) {
    const recept = {
      UID: data.UID,
      naam: data.naam,
      aantalPersonen: data.aantalPersonen,
      benodigdeTijd: data.benodigdeTijd,
      beschrijving: data.beschrijving,
      bereiding: data.bereiding,
      isPubliek: data.isPubliek,
      ingredienten: data.ingredienten,
      thumbnail: data.thumbnail,
      userUID: data.userUID
    };
    return recept;
  }

  deleteRecept(receptUID: string) {
    return this.afs.doc(`recept/${receptUID}`).delete().then(() => {
      const opslagref = this.fireStorage.storage.ref();
      opslagref.child(`receptFotos/${receptUID}`).delete();
      this.shareService.deleteSharesForRecept(receptUID);
    });
  }
}
