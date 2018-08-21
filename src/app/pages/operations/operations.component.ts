import {Component, OnDestroy, OnInit} from '@angular/core';

import { ApiService } from '../../services/api.service';
import { ToastrMessageService } from '../../services/toastr.service';
import { NodeDataService } from '../../services/node-data.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit, OnDestroy {
  public operationsBalance = 0;
  public operationsFrom: string;
  public operationsShard: number;

  public operationsTo: string;
  public operationsAmount: string;
  public toShard: number;

  public addressToCheck: string;
  public balanceToCheck: string;
  public checkShard: number;

  public isSendDisabled = false;
  public isCheckDisabled = false;
  isNodeStarted = false;
  clearBalanceInterval = null;

  constructor(private apiService: ApiService,
              private nodeDataService: NodeDataService,
              private toastr: ToastrMessageService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.loadingService.show();
    this.getBalance();
    this.getNodeStatus();
    this.getShardOfAddress(this.operationsFrom, 'operationsShard');
    this.loadingService.hideDelay(500);

    this.nodeDataService.nodeStatus.subscribe(status => this.isNodeStarted = status);
  }

  getBalance() {
    const node = this.nodeDataService.load('start');
    this.operationsFrom = node.publicKey;

    if (this.operationsFrom) {
      this.clearBalanceInterval = setInterval(() => {
        this.apiService.getBalance(this.operationsFrom).subscribe(res => {
          const {success, payload} = res;

          this.operationsBalance = (success && payload) ? payload : 0;
        });
      }, 2000);
    }
  }

  onChangeAddress(event, field) {
    this.getShardOfAddress(event.target.value, field);
  }

  getShardOfAddress(address, field): void {
    if (address === '') {
      this[field] = '';
      return;
    }

    this.apiService.getShardOfAddress(address).subscribe((res) => {
      this[field] = res.payload;
    });
  }

  getNodeStatus(): void {
    this.apiService.getStatus().subscribe((status) => {
      if (this.isNodeStarted !== status) {
        this.nodeDataService.set(status);
      }
    });
  }

  checkBalance(event) {
    this.isCheckDisabled = true;
    this.loadingService.show();

    this.apiService.getBalance(this.addressToCheck).subscribe(res => {
      const {success, payload} = res;

      this.balanceToCheck = (success && payload) ? payload : 0;
      this.isCheckDisabled = false;
      this.loadingService.hideDelay();
    });
  }

  send(e): void {
    this.isSendDisabled = true;
    this.loadingService.show();

    this.apiService.sendBalance(this.operationsTo, this.operationsAmount).subscribe(res => {
      const {success} = res;

      if (success) {
        this.toastr.show({
          title: 'Success',
          message: `Transaction sent to the blockchain`,
        });
        this.operationsTo = '';
        this.operationsAmount = '';
      } else {
        this.toastr.show({
          title: 'Fail',
          message: res.message,
        }, 'error');
      }

      this.isSendDisabled = false;
      this.loadingService.hideDelay();
    });
  }

  ngOnDestroy() {
    if (this.clearBalanceInterval) {
      clearInterval(this.clearBalanceInterval);
    }
  }
}
