import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {MijnAccountComponent} from './mijn-account/mijn-account.component';
import {AuthGuard} from './guards/auth.guard';
import {ReceptFormComponent} from './recept-form/recept-form.component';
import {ReceptDetailComponent} from './recept-detail/recept-detail.component';
import {PolicyComponent} from './policy/policy.component';
import {ReceptLijstComponent} from './recept-lijst/recept-lijst.component';
import {ApiSearchComponent} from './api-search/api-search.component';
import {ApiOpslagComponent} from './api-opslag/api-opslag.component';
import {AccountDetailComponent} from './account-detail/account-detail.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'mijnAccount', component: MijnAccountComponent, canActivate: [AuthGuard]},
  {path: 'accountDetail', component: AccountDetailComponent, canActivate: [AuthGuard]},
  {path: 'receptFormulier', component: ReceptFormComponent, canActivate: [AuthGuard]},
  {path: 'receptDetail', component: ReceptDetailComponent, canActivate: [AuthGuard]},
  {path: 'receptLijst', component: ReceptLijstComponent, canActivate: [AuthGuard]},
  {path: 'apiSearch', component: ApiSearchComponent, canActivate: [AuthGuard]},
  {path: 'apiOpslag', component: ApiOpslagComponent, canActivate: [AuthGuard]},
  {path: 'privacy-policy', component: PolicyComponent},
  {path: '', component: HomeComponent},
  {path: '**', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
