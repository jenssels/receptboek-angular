import {Component, OnInit} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private swUpdate: SwUpdate) {
  }

  ngOnInit() {
    this.swUpdate.available.subscribe(evt => {
        console.log('evt', evt);
        if (confirm('De website is aangepast. Wil je de nieuwe versie openen?')) {
          window.location.reload();
        }
      }
    );
  }
}
