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
  public stats: Stats;
  public accountBalance = 0;
  public accountFrom: string;
  public accountShard: number;

  public benchmarkTo = '';
  public benchmarkAmount = '';
  public benchmarkNrTrans = '';
  public benchmarkShard: number;

  public isSendDisabled = false;
  public isNodeStarted = false;
  public shardDataList = [
    {
      averageRoundTime: 0,
      liveRoundTime: 0,
      totalNrProcessedTransactions: 0,
      averageNrTxPerBlock: 0,
      liveTps: 0,
      peakTps: 0,
      liveNrTransactionsPerBlock: 0,
    },
    {
      averageRoundTime: 0,
      liveRoundTime: 0,
      totalNrProcessedTransactions: 0,
      averageNrTxPerBlock: 0,
      liveTps: 0,
      peakTps: 0,
      liveNrTransactionsPerBlock: 0,
    }
  ];

  public global = {
    activeNodes: 0,
    nrShards: 0,
    peakTps: 0,
    liveTps: 0,
  };

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
        }
      }]
    }
  };
  public chartType = 'line';
  public chartLegend = true;
  public chartLabels: string[] = ['t-20', 't-19', 't-18', 't-17', 't-16', 't-15', 't-14', 't-13', 't-12', 't-11', 't-10', 't-9', 't-8', 't-7', 't-6', 't-5', 't-4', 't-3', 't-2', 't-1', 't'];

  public xxx = {
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    label: `No data`,
    lineTension: 0,
    pointRadius: 4,
    hidden: false
  };
  public chartDatasets: any[] = [
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: `No data`,
      lineTension: 0,
      pointRadius: 4,
      hidden: false
    },
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: `No data`,
      lineTension: 0,
      pointRadius: 4,
      hidden: false
    },
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: `No data`,
      lineTension: 0,
      pointRadius: 4,
      hidden: false
    }
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
        this.apiService.getBalance(this.accountFrom).subscribe(res => {
          const {success, payload} = res;
          this.accountBalance = (success && payload) ? payload : 0;
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
      const {success, payload} = res;

      if (success) {
        this[field] = payload;
      }
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
      this.apiService.getStats().subscribe(res => {
        const {success, payload} = res;

        if (success) {
          const results = payload;

          const cDataSet = [];

          this.global.nrShards = results.nrShards;
          this.global.activeNodes = results.networkActiveNodes;
          this.global.peakTps = Number(results.globalPeakTps.toFixed(0));
          this.global.liveTps = Number(results.globalLiveTps.toFixed(0));

          // tabs
          this.shardDataList = results.statisticList.map((result) => {
            return {
              index: result.currentShardNumber,
              averageRoundTime: (result.averageRoundTime / 1000).toString(),
              liveRoundTime: (result.liveRoundTime / 1000).toString(),
              totalNrProcessedTransactions: result.totalNrProcessedTransactions,
              averageNrTxPerBlock: result.averageNrTxPerBlock.toString(),
              liveTps: Number(result.liveTps).toFixed(0),
              peakTps: Number(result.peakTps).toFixed(0),
              liveNrTransactionsPerBlock: result.liveNrTransactionsPerBlock.toString(),
            };
          });

          for (let i = 0; i < results.nrShards; i++) {
            const result = results.statisticList[i];
            const cData = (this.chartDatasets[i] && this.chartDatasets[i].data) ? this.chartDatasets[i].data : this.xxx;
            cDataSet.push({
              data: this.addData(cData, result.liveTps),
              label: `Shard ${i}`,
              lineTension: 0,
              pointRadius: 4,
              hidden: visibleChartIndex[i]
            });

          }

          const globalData = (this.chartDatasets[results.nrShards] && this.chartDatasets[results.nrShards].data) ? this.chartDatasets[results.nrShards].data : this.xxx;

          cDataSet.push(
            {
              data: this.addData(globalData, this.global.liveTps),
              label: `Global`,
              lineTension: 0,
              pointRadius: 4,
              hidden: visibleChartIndex[1]
            }
          );

          this.chartDatasets = cDataSet;
        }
      });
    }, 2000);
  }

  sendMultipleTransactions(e): void {
    this.isSendDisabled = true;
    this.loadingService.show();

    this.apiService.sendMultipleTransactions(this.benchmarkTo, this.benchmarkAmount, this.benchmarkNrTrans).subscribe(res => {
      const {success} = res;

      if (success) {
        this.toastr.show({
          title: 'Success',
          message: `Multi Transaction sent to the blockchain`,
        });
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
}
