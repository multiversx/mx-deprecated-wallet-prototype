import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { ToastrMessageService } from '../../services/toastr.service';
import { NodeDataService } from '../../services/node-data.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {
  public operationsBalance = 0;
  public operationsFrom: string;
  public operationsTo: string;
  public operationsAmount: string;
  public operationsMyShard: number;

  public operationsSendShard: number;
  public operationsSearchShard: number;
  public operationsBenchShard: number;

  public addressToCheck: string;
  public balanceToCheck: string;
  public isDisabled = true;

  constructor(private apiService: ApiService,
              private nodeDataService: NodeDataService,
              private toastr: ToastrMessageService) {
  }

  ngOnInit() {
    this.getBalance();
    this.getNodeStatus();
  }

  getBalance() {
    const node = this.nodeDataService.load('start');
    this.operationsFrom = node.publicKey;

    if (this.operationsFrom) {
      setInterval(() => {
        this.apiService.getBalance(this.operationsFrom).subscribe(result => {
          if (!result) {
            result = 0;
          }
          this.operationsBalance = result;
        });
      }, 1000);
    }
  }

  getNodeStatus(): void {
    this.apiService.getStatus().subscribe((status) => this.isDisabled = !status);
  }

  checkBalance(event) {
    this.apiService.getBalance(this.addressToCheck).subscribe(result => {
      if (!result) {
        result = 0;
      }
      this.balanceToCheck = result;
    });
  }

  send(e): void {
    this.apiService.sendBalance(this.operationsTo, this.operationsAmount).subscribe(result => {

      if (result) {
        this.toastr.show({
          title: 'Success',
          message: `Operation was finished with success`,
        });
      } else {
        this.toastr.show({
          title: 'Fail',
          message: `Operation has failed`,
        }, 'error');
      }
    });
  }

  check(e) {
    console.log(e);
  }
}
