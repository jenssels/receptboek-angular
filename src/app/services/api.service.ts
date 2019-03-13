import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import {catchError, share, tap} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  readonly path = 'https://api.edamam.com/search';
  readonly appID = 'XXXX';
  readonly appKey = 'XXXXXX';

  constructor(private http: HttpClient) {

  }

  // Jens Sels - Ophalen van recepten van externe API met zoek string
  getRecipes$(search, from): Observable<any> {
    const params = new HttpParams()
      .set('q', search)
      .set('app_id', this.appID)
      .set('app_key', this.appKey)
      .set('from', from);


    return this.http.get(this.path, {params})
      .pipe(
        tap(req => console.log('get-request', req)),
        catchError(
          (error) => {
            console.log(error);
            alert(error.message);
            return EMPTY;
          }),
        share()
      );
  }

  setAPIRecept(apiRecept: any) {
    const recept = {
      naam: apiRecept.label,
      fotoCode: apiRecept.image,
      link: apiRecept.shareAs,
      aantalPersonen: apiRecept.yield,
      calories: apiRecept.calories,
      tijd: apiRecept.totalTime
    };
    return recept;
  }
}
