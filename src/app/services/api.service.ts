import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {MessageService} from './message.service';
import {environment} from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = environment.api + environment.endpoint;

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

  /** PING: add data to the server */
  ping(payload): Observable<any> {
    const url = `${this.url}/ping?${payload}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError('ping', []))
      );
  }


  /**
   * Get balance
   * @param address
   * @returns {Observable<any>}
   */
  getBalance(address): Observable<any> {
    const url = `${this.url}/balance?address=${address}`;
    return this.http.get<any[]>(url)
      .pipe(
        catchError(this.handleError('ping', []))
      );
  }

  /**
   * Send value to address
   * @param address
   * @param value
   * @returns {Observable<any>}
   */
  sendBalance(address, value): Observable<any> {
    const url = `${this.url}/send?address=${address}&value=${value}`;
    return this.http.get<any[]>(url)
      .pipe(
        catchError(this.handleError('ping', []))
      );
  }


  generateKeys(): Observable<any> {
    const url = `${this.url}/publickeyandprivatekey`;
    return this.http.get<any[]>(url)
      .pipe(
        catchError(this.handleError('publickeyandprivatekey', []))
      );
  }

  generatePublicKey(privateKey): Observable<any> {
    const url = `${this.url}/publickeyfromprivatekey?privateKey=${privateKey}`;
    return this.http.get<any[]>(url)
      .pipe(
        catchError(this.handleError('publickeyfromprivatekey', []))
      );
  }


  startNode(nodeName,
            port,
            masterPeerPort,
            masterPeerIpAddress,
            privateKey):
    Observable<any> {

    const url = `${this.url}/start?nodeName=${nodeName}&port=${port}&masterPeerPort=${masterPeerPort}&masterPeerIpAddress=${masterPeerIpAddress}&privateKey=${privateKey}`;

    return this.http.get<any[]>(url)
      .pipe(
        catchError(this.handleError('ping', []))
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
