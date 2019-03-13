import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: []
})
export class FooterComponent implements OnInit {

  showBanner = false;
  deferredPrompt: any;

  constructor() {
  }

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', evt => {
      console.log('beforeinstallprompt', evt);
      // Voorkomen dat Chrome 67 of eerder de "native" prompt toont
      evt.preventDefault();
      // Bewaar het event zodat je dit later kan activeren
      this.deferredPrompt = evt;
      // Update de UI om aan te geven dat de app kan worden geïnstalleerd
      this.showBanner = true;
      console.log('this.showBanner', this.showBanner);
    });
  }

  addToHomescreen() {
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((choiceResult) => {
      console.log('choiceResult', choiceResult);
      if (choiceResult.outcome === 'accepted') {
        alert('User accepted the prompt');
      } else {
        alert('User dismissed the prompt');
      }
      this.deferredPrompt = null;
      this.showBanner = false;
    });
  }

}
