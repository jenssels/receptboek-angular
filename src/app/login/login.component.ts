import {Component, OnInit} from '@angular/core';
import {AlertMessage} from '../interfaces/alert-message';
import {GebruikerService} from '../services/gebruiker.service';
import {Router} from '@angular/router';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  registreer = false;

  loginData = {
    email: '',
    wachtwoord: '',
    wachtwoordConfirm: ''
  };

  alertBox: AlertMessage = {
    message: '',
    color: ''
  };

  constructor(public gebruikerService: GebruikerService, private router: Router) {    // LET OP: injecteer public !!!!
  }

  ngOnInit() {
    if (localStorage.getItem('loginData')) {
      this.loginData = JSON.parse(localStorage.getItem('loginData'));
    }
    this.gebruikerService.alertBox$.subscribe(data => {
      this.alertBox = data;
    });
  }

  emailSignUp(data: any, isValid: string) {
    console.log(data);
    this.gebruikerService.clearMessage();
    if (data.registerWachtwoord !== data.registerWachtwoordConfirm) {
      this.gebruikerService.setMessage('Wachtwoorden komen niet overeen', 'alert-danger');
    } else if (isValid) {
      this.gebruikerService.emailSignUp(data.registerEmail, data.registerWachtwoord);
      localStorage.setItem('loginData', JSON.stringify(data));
    } else {
      this.gebruikerService.setMessage('Error', 'alert-danger');
    }
  }

  emailLogin(data: any, isValid: string) {
    console.log(data);
    this.gebruikerService.clearMessage();
    if (isValid) {
      this.gebruikerService.emailLogin(data.email, data.wachtwoord);
      localStorage.setItem('loginData', JSON.stringify(data));
    } else {
      this.gebruikerService.setMessage('E-mail en wachtwoord combinatie fout', 'alert-danger');
    }
  }
}
