import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = 'api/';

  constructor(private http: HttpClient,
              private messageService: MessageService) {
  }

  /** GET data from the server */
  get(): Observable<any[]> {
    return this.http.get<any[]>(this.url)
      .pipe(
        catchError(this.handleError('get', []))
      );
  }


  /** POST: add data to the server */
  post(payload): Observable<any> {
    return this.http.post<any>(this.url, payload, httpOptions).pipe(
      catchError(this.handleError<any>('post'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error('API error:', error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  /** Log a API message with the MessageService */
  private log(message: string) {
    this.messageService.add('API log: ' + message);
  }
}
