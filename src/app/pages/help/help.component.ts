import { Component, OnInit } from '@angular/core';
import {NodeDataService} from '../../services/node-data.service';
import {ApiService} from '../../services/api.service';
import {ToastrMessageService} from '../../services/toastr.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  public isNodeStarted = false;
  protected downloadInProgress = false;
  protected selectShards = [
    {label: 'Current node', value: ''},
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
              private nodeDataService: NodeDataService,
              private toastr: ToastrMessageService) {
  }

  static downloadBlobFile(file) {
    const objurl = window.URL.createObjectURL(file);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = objurl;
    a.download = 'logs.zip';
    a.click();
    window.URL.revokeObjectURL(objurl);
    a.remove();
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
    this.apiService.saveNodeLogs(this.selectedShard)
      .subscribe(res => {
        if ( !res || res['size'] === 0 ) {
          return this.toastr.show({
            title: 'Error',
            message: `There are no logs to download`,
          }, 'error');
        }
        HelpComponent.downloadBlobFile(res);
        this.toastr.show({
          title: 'Success',
          message: `Logs are ready for download`,
        });
      }, error => {
        console.warn(error);
      });
    this.downloadInProgress = false;
  }


}
