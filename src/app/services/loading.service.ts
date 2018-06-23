import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoadingState } from '../models/loading';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loaderSubject = new Subject<LoadingState>();
  public loaderState = this.loaderSubject.asObservable();

  constructor() {
  }

  show() {
    this.loaderSubject.next(<LoadingState>{show: true});
  }

  hide() {
    this.loaderSubject.next(<LoadingState>{show: false});
  }

  hideDelay(time = 1000) {
    setTimeout(() => {
      this.hide();
    }, time);
  }
}
