import { Injectable } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private afs: AngularFirestore) {}

  // Jens Sels - Een recept delen met een bepaalde user
  shareReceptForUser(receptUID, userUID) {
    const shareUID = this.afs.createId();

    return this.afs.doc(`receptDeeling/${shareUID}`)
      .set({UID: shareUID, receptUID: receptUID, userUID: userUID})
      .then(
        () => {
          console.log(`Recept ${receptUID} successfully shared with ${userUID} !`);
        }
      ).catch(
        error => {
          console.error('Error writing recept: ', error);
        }
      );
  }

  // Jens Sels - Een user toegang ontnemen van een recept
  unshareRecept(shareUID) {
    return this.afs.doc(`receptDeeling/${shareUID}`).delete();
  }

  // Jens Sels - Ophalen van alle gebruikers die toegang hebben tot een recept
  getSharedUsersForRecept(receptUID) {
    return this.afs.collection<any>('receptDeeling',
      ref => ref.where('receptUID', '==', receptUID)
    ).valueChanges();
  }

  // Jens Sels - Ophalen van alle gedeelde recepten van een user
  getSharedReceptenForUser(userUID) {
    return this.afs.collection<any>('receptDeeling',
      ref => ref.where('userUID', '==', userUID)
    ).valueChanges();
  }
  // Jens Sels - Verwijderen van alle deelingen van een recept
  deleteSharesForRecept(receptUID: any) {
    this.getSharedUsersForRecept(receptUID).subscribe(shares => {
      shares.forEach(element => {
        this.unshareRecept(element.UID);
      });
    });
  }
}
