import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgBootstrapModule} from './sharedModules/ng-bootstrap.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FooterComponent } from './footer/footer.component';
import {FirebaseImportsModule} from './sharedModules/firebase-imports.module';
import {FormsModule} from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { LoginModule } from './login/login.module';
import { MijnAccountComponent } from './mijn-account/mijn-account.component';
import { MijnAccountModule } from './mijn-account/mijn-account.module';
import {WebcamModule} from 'ngx-webcam';
import { ReceptFormComponent } from './recept-form/recept-form.component';
import { ReceptFormModule } from './recept-form/recept-form.module';
import { ReceptDetailComponent } from './recept-detail/recept-detail.component';
import { ReceptDetailModule } from './recept-detail/recept-detail.module';
import { ReceptRenderComponent } from './recept-render/recept-render.component';
import { ReceptRenderModule } from './recept-render/recept-render.module';
import { PolicyComponent } from './policy/policy.component';
import { PolicyModule } from './policy/policy.module';
import { ReceptLijstComponent } from './recept-lijst/recept-lijst.component';
import { ReceptLijstModule } from './recept-lijst/recept-lijst.module';
import { ApiSearchComponent } from './api-search/api-search.component';
import { ApiSearchModule } from './api-search/api-search.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiOpslagComponent } from './api-opslag/api-opslag.component';
import { ApiOpslagModule } from './api-opslag/api-opslag.module';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountDetailModule } from './account-detail/account-detail.module';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    MijnAccountComponent,
    ReceptFormComponent,
    ReceptDetailComponent,
    ReceptRenderComponent,
    HomeComponent,
    PolicyComponent,
    ReceptLijstComponent,
    ApiSearchComponent,
    ApiOpslagComponent,
    AccountDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgBootstrapModule,
    FormsModule,
    FirebaseImportsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    LoginModule,
    MijnAccountModule,
    WebcamModule,
    ReceptFormModule,
    ReceptDetailModule,
    ReceptRenderModule,
    PolicyModule,
    ReceptLijstModule,
    ApiSearchModule,
    HttpClientModule,
    ApiOpslagModule,
    AccountDetailModule
  ],
    providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
