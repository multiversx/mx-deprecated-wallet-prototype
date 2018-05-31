import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {
  public operationsBalance: number;
  public operationsFrom: string;
  public operationsTo: string;
  public operationsAmount: string;

  constructor() { }

  ngOnInit() {
  }

  send(e) {
    console.log('send');
  }

}
