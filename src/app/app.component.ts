import { Component, OnInit } from '@angular/core';

import { NodeDataService } from './services/node-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private nodeDataService: NodeDataService) {
  }

  ngOnInit() {
    this.nodeDataService.clear('main');
  }
}
