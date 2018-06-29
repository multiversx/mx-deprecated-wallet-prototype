import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Stats } from '../../models/stats';
import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { NodeDataService } from '../../services/node-data.service';
import { ToastrMessageService } from '../../services/toastr.service';

const visibleChartIndex = [false, false];

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, AfterViewInit {
  self = this;
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

  // Chart
  //
  public chartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    animation: {
      duration: 0,
    },
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0,
          suggestedMax: 50
        }
      }]
    }
  };
  public chartType = 'line';
  public chartLegend = true;
  public chartLabels: string[] = ['t-11', 't-10', 't-9', 't-8', 't-7', 't-6', 't-5', 't-4', 't-3', 't-2', 't-1', 't'];
  public chartDatasets: any[] = [];

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

  @ViewChild('statsChart') public statsChart;

  constructor(private apiService: ApiService,
              private nodeDataService: NodeDataService,
              private toastr: ToastrMessageService,
              private loadingService: LoadingService,
              private changeDetectionRef: ChangeDetectorRef) {
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

  ngAfterViewInit(): void {
    this.changeDetectionRef.detectChanges();
  }

  toggleDataset(index) {
    visibleChartIndex[index] = !visibleChartIndex[index];
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

  addData(data, value) {
    data.push(value);
    data.shift();
    return data;
  }

  getStats() {
    setInterval(() => {
      this.apiService.getStats().subscribe(results => {
        console.table(results);
        const cDataSet = [];

        for (let i = 0; i < results.length; i++) {
          const result = results[i];

          this.stats.activeNodes = result.activeNodes;
          this.stats.nrShards = result.nrShards;
          this.stats.averageRoundTime = (result.averageRoundTime / 1000).toString();
          this.stats.liveRoundTime = (result.liveRoundTime / 1000).toString();
          this.stats.totalNrProcessedTransactions = result.totalNrProcessedTransactions;
          this.stats.averageNrTxPerBlock = result.averageNrTxPerBlock;
          this.stats.liveTps = Number(result.liveTps).toFixed(2);
          this.stats.peakTps = Number(result.peakTps).toFixed(2);
          this.stats.liveNrTransactionsPerBlock = result.liveNrTransactionsPerBlock;

          const initialData =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

          const cData = (this.chartDatasets[i] && this.chartDatasets[i].data) ? this.chartDatasets[i].data :  initialData;

          cDataSet.push({
            data: this.addData(cData, result.liveTps),
            label: `Live TPS ${i}`,
            lineTension: 0,
            pointRadius: 4,
            hidden: visibleChartIndex[i]
          });
        }

        this.chartDatasets = cDataSet;
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
}
