import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Node } from '../models/node';

@Injectable({
  providedIn: 'root'
})
export class NodeDataService {

  private nodeData = new Subject<Node>();
  currentData = this.nodeData.asObservable();

  constructor() {
  }

  save( key, data) {
    // this.nodeData.next(data);
    localStorage.setItem('node' + key, JSON.stringify(data));
  }

  load(key): Node {
    const localStorageData = localStorage.getItem('node' + key);
    return (localStorageData) ? JSON.parse(localStorageData) as Node : Node.getDefault();
  }
}
