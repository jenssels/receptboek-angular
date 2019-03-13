import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {BehaviorSubject, Observable} from 'rxjs';
import {AlertMessage} from '../interfaces/alert-message';
import {Gebruiker} from '../interfaces/gebruiker';
import {Router} from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class GebruikerService {

  alertBox$: BehaviorSubject<AlertMessage> = new BehaviorSubject(null);
  userData$: BehaviorSubject<Gebruiker> = new BehaviorSubject(null);
  userInfoData$: Observable<any>;

  constructor(private afAuth: AngularFireAuth, private router: Router, private afs: AngularFirestore) {
    this.afAuth.authState.subscribe((user) => {
        this.setUserData(user);
      }
    );
  }

  // Email/password sing up
  emailSignUp(email: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.afAuth.auth.currentUser.sendEmailVerification()
          .then(success => {
            this.logout();
            this.setMessage(`U bent succesvol geregistreerd.<br>` +
              `Voltooi u registratie via de mail die we gestuurd hebben`, 'alert-success');
          })
          .catch(error => this.setMessage(error, 'alert-danger'));
      })
      .catch(error => {
        this.setMessage(error.message, 'alert-danger');
      });
  }

  // Reset password
  emailResetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => this.setMessage('Controleer je mailbox', 'alert-success'))
      .catch(error => this.setMessage(error, 'alert-danger'));
  }

  // Email/password login
  emailLogin(email: string, password: string) {
    this.logout();
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        if (!user.user.emailVerified) {
          this.logout();
          this.setMessage(`Voltooi u registratie!<br>
                        Controleer je mailbox: ${user.user.email}`, 'alert-danger');
        } else {
          this.setUserData(user.user);
          const errorCatch = this.router.navigateByUrl('/home');
        }
      })
      .catch(error => this.setMessage('E-mail en wachtwoord combinatie komen niet overeen', 'alert-danger'));
  }

  // Social logins
  googleLogin() {
    this.logout();
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then( () =>
    this.router.navigateByUrl('/home')
    ).catch(error => this.setMessage(error.message, 'alert-danger'));
  }

  facebookLogin() {
    this.logout();
    this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider()).then( () => (
      this.router.navigateByUrl('/home'))
    )
      .catch(error => this.setMessage(error.message, 'alert-danger'));
  }

  // Logout
  logout() {
    this.clearMessage();
    this.afAuth.auth.signOut();
    this.userData$.next(null);
  }


  // Message BS4 alert-box
  setMessage(msg: string, color: string) {
    this.alertBox$.next({
      message: msg,
      color: color
    });
  }

  clearMessage() {
    this.alertBox$.next(null);
  }

  // Jens Sels - Gegevens uit authstate ophalen en in userData$ steken.
  // Ophalen van gebruikerInfo en nieuw document aanmaken indien deze nog niet bestaat
  private setUserData(user) {
    if (user !== null) {
      this.userInfoData$ =  this.afs.doc(`gebruikerInfo/${user.uid}`).valueChanges();
      this.userInfoData$.subscribe(info => {
        if (info == null) {
          this.newGebruikerInfo(info, user);
          info = {
            uid: null,
            gebruikersnaam: user.displayName || user.email,
            isAdmin: false,
            beschrijving: null,
            fotoCode: null,
            email: user.email
          };
        }
        this.userData$.next({
          uid: user.uid,
          gebruikersnaam: info.gebruikersnaam || user.displayName || user.email,
          fotoCode: info.fotoCode || user.photoURL || '/assets/icons/icon-72x72.png',
          email: user.email,
          beschrijving: info.beschrijving,
          isAdmin: info.isAdmin,
        });
      });
    } else {
      this.userData$.next(null);
    }
  }
  // Jens Sels - Aanmaken van gebruikerInfo document als een nieuwe gebruiker zich voor de eerste keer aanmeld of registreerd
  private newGebruikerInfo(data: any, user: any) {
    if (data == null) {
      this.afs.doc(`gebruikerInfo/${user.uid}`)
        .set({uid: user.uid, gebruikersnaam: user.displayName || user.email,
          beschrijving: null, fotoCode: null, isAdmin: false, email: user.email})
        .then(
          () => console.log('Document successfully written!')
        ).catch(
        error => console.error('Error writing document: ', error)
      );
    }
  }


  // Jens Sels - Ophalen van een gebruiker
  public getUser(UID: any) {
    return this.afs.doc(`gebruikerInfo/${UID}`).valueChanges();
  }

  public setUser(user: any) {
    return {gebruikersnaam: user.gebruikersnaam || user.email, fotoCode: user.fotoCode, beschrijving: user.beschrijving, email: user.email};
  }

  public setGebruikerInfo(user: any) {
    return {uid: user.uid, gebruikersnaam: user.gebruikersnaam || user.email, fotoCode: user.fotoCode, beschrijving: user.beschrijving, email: user.email, isAdmin: user.isAdmin};
  }
  // Jens Sels - Ophalen van alle gebruikers
  public getAllUsers() {
    return this.afs.collection<any>('gebruikerInfo').valueChanges();
  }

}
