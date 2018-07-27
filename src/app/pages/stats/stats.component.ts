import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
export class StatsComponent implements OnInit, AfterViewInit, OnDestroy {
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
  public selectedShard = '';
  public selectedShardNumber = 0;
  public selectedShardStatistic = {
      averageRoundTime: 0,
      liveRoundTime: 0,
      totalNrProcessedTransactions: 0,
      averageNrTxPerBlock: 0,
      liveTps: 0,
      peakTps: 0,
      liveNrTransactionsPerBlock: 0,
    };
  public selectNodeTypes = [
    {
      label: 'Start as a first node',
      value: 1
    },
    {
      label: 'Join the network as a peer node',
      value: 2
    }
  ];

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
  public chartType = 'bar';
  public chartLegend = true;
  public chartLabels: string[] = ['Shard0', 'Shard1','Shard2','Shard3','Shard4','Shard5','Shard6','Shard7','Shard8','Shard9'];

  public xxx = {
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    label: `No data`,
    lineTension: 0,
    pointRadius: 4,
    hidden: false
  };
  public chartDatasets: any[] = [
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

  private clearBalanceInterval = null;
  private clearStatsInterval = null;

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

  ngOnDestroy(): void {
    if (this.clearStatsInterval) {
      clearInterval(this.clearStatsInterval);
    }

    if (this.clearBalanceInterval) {
      clearInterval(this.clearBalanceInterval);
    }
  }

  toggleDataset(index) {
    visibleChartIndex[index] = !visibleChartIndex[index];
  }

  getBalance() {
    const node = this.nodeDataService.load('start');
    this.accountFrom = node.publicKey;

    if (this.accountFrom) {
      this.clearBalanceInterval = setInterval(() => {
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
    this.clearStatsInterval = setInterval(() => {
      this.apiService.getStats().subscribe(res => {
        const {success, payload} = res;

        if (success) {
          const results = payload;

          const mainDataSet = [];
          const liveDataSet = [];
          const peakDataSet = [];

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

          this.selectedShardStatistic = this.shardDataList[this.selectedShardNumber];

          for (let i = 0; i < results.nrShards; i++) {
            const result = results.statisticList[i];
            liveDataSet.push(result.liveTps.toFixed(2));
            peakDataSet.push(result.peakTps.toFixed(2));
          }

          mainDataSet.push(
            {
              data: liveDataSet,
              label: `Live TPS: ` + results.globalLiveTps.toFixed(0),
              lineTension: 0,
              pointRadius: 4,
              hidden: visibleChartIndex[1]
            }
          );

          mainDataSet.push(
            {
              data: peakDataSet,
              label: `Peak TPS: `+ results.globalPeakTps.toFixed(0),
              lineTension: 0,
              pointRadius: 4,
              hidden: visibleChartIndex[1]
            }
          );

          this.chartDatasets = mainDataSet;
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

  onChange() {
    this.selectedShardNumber = Number(this.selectedShard.replace('Shard',''));
    this.selectedShardStatistic = this.shardDataList[this.selectedShardNumber];
    console.log(this.selectedShardStatistic);
  }
}
