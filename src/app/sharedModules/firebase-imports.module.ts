import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { AngularFireStorageModule } from 'angularfire2/storage';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),  // nodig voor alles
    AngularFirestoreModule.enablePersistence(),             // Cloud Firestore (met offline data persistence)
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  exports: [
    AngularFireModule,  // nodig voor alles
    AngularFirestoreModule,  // Cloud Firestore (met offline data persistence)
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  declarations: []
})
export class FirebaseImportsModule { }
