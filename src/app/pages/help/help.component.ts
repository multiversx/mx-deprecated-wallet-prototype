import { Component, OnInit } from '@angular/core';
import {NodeDataService} from '../../services/node-data.service';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  protected isNodeStarted = false;
  protected downloadInProgress = false;
  protected selectShards = [
    {label: 'Current node', value: 'current'},
    {label: 'Shard 0', value: 0},
    {label: 'Shard 1', value: 1},
    {label: 'Shard 2', value: 2},
    {label: 'Shard 3', value: 3},
    {label: 'Shard 4', value: 4},
    {label: 'Shard 5', value: 5},
    {label: 'Shard 6', value: 6},
    {label: 'Shard 7', value: 7},
    {label: 'Shard 8', value: 8},
    {label: 'Shard 9', value: 9},
  ];
  protected selectedShard;
  constructor(private apiService: ApiService,
              private nodeDataService: NodeDataService) {
  }

  ngOnInit() {
    this.getNodeStatus();
    this.nodeDataService.nodeStatus.subscribe(status => this.isNodeStarted = status);
  }

  getNodeStatus(): void {
    this.apiService.getStatus().subscribe((status) => {
      if (this.isNodeStarted !== status) {
        this.nodeDataService.set(status);
      }
    });
  }

  downloadLogs(): void {
    this.downloadInProgress = true;
    this.apiService.saveNodeLogs(this.selectedShard, 'logs.zip');
    this.downloadInProgress = false;
  }
}
