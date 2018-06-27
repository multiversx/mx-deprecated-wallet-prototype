import { Component, OnInit } from '@angular/core';
import { Stats } from '../../models/stats';
import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { NodeDataService } from '../../services/node-data.service';
import { ToastrMessageService } from '../../services/toastr.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  public stats: Stats;

  public accountBalance = 0;
  public accountFrom: string;
  public accountShard: number;

  public benchmarkTo: string;
  public benchmarkAmount: string;
  public benchmarkNrTrans: string;
  public benchmarkShard: number;

  public isSendDisabled = false;
  public isNodeStarted = false;


  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  public receiver = {
    address: '',
    amountPerTx: '',
    nrOfTx: '',
    shard: ''
  };

  public account = {
    address: '',
    balance: '',
    shard: ''
  };

  constructor(private apiService: ApiService,
              private nodeDataService: NodeDataService,
              private toastr: ToastrMessageService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.loadingService.show();
    this.stats = Stats.getDefault();
    this.getNodeStatus();
    this.getBalance();
    this.getShardOfAddress(this.accountFrom, 'accountShard');
    this.loadingService.hideDelay(500);
    this.getStats();
    this.nodeDataService.nodeStatus.subscribe(status => this.isNodeStarted = status);
  }

  getBalance() {
    const node = this.nodeDataService.load('start');
    this.accountFrom = node.publicKey;

    if (this.accountFrom) {
      setInterval(() => {
        this.apiService.getBalance(this.accountFrom).subscribe(result => {
          if (!result) {
            result = 0;
          }
          this.accountBalance = result;
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
      this[field] = res;
    });
  }

  getNodeStatus(): void {
    this.apiService.getStatus().subscribe((status) => {
      if (this.isNodeStarted !== status) {
        this.nodeDataService.set(status);
      }
    });
  }

getStats() {
     setInterval(() => {
       this.apiService.getStats().subscribe(result => {
          console.log(result);
    this.stats.activeNodes = result.activeNodes;
    this.stats.nrShards = result.nrShards;
    this.stats.averageRoundTime = result.averageRoundTime;
    this.stats.averageNrTxPerBlock = result.averageNrTxPerBlock;
    this.stats.liveTps = result.liveTps
    this.stats.peakTps = result.peakTps;
    this.stats.averageTps = result.averageTps;
    this.stats.liveNrTransactionsPerBlock = result.liveNrTransactionsPerBlock;
       });
     }, 2000);
   }

  sendMultipleTransactions(e): void {
    this.isSendDisabled = true;
    this.loadingService.show();

    this.apiService.sendMultipleTransactions(this.benchmarkTo, this.benchmarkAmount, this.benchmarkNrTrans).subscribe(result => {
      if (result) {
        console.log(result);
        this.toastr.show({
          title: 'Success',
          message: `Multi Transaction sent to the blockchain`,
        });
        this.benchmarkTo = '';
        this.benchmarkAmount = '';
        this.benchmarkNrTrans = '';
      } else {
        this.toastr.show({
          title: 'Fail',
          message: `Multi Transaction sending has failed`,
        }, 'error');
      }

      this.isSendDisabled = false;
      this.loadingService.hideDelay();
    });
  }


  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    const clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
  }

}
