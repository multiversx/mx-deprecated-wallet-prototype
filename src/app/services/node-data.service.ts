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

  save(data) {
    // this.nodeData.next(data);
    localStorage.setItem('node', JSON.stringify(data));
  }

  load(): Node {
    const localStorageData = localStorage.getItem('node');
    return (localStorageData) ? JSON.parse(localStorageData) as Node : Node.getDefault();
  }
}
