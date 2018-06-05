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
    const val =  localStorage.getItem('node') ;
    return (val) ? JSON.parse(val) as Node : Node.getDefault();
  }
}
