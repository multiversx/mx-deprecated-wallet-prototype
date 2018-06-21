import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {NodeDataService} from '../../services/node-data.service';
import {ToastrMessageService} from '../../services/toastr.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public isAppStarted = false;
  constructor(private apiService: ApiService,
              private nodeDataService: NodeDataService,
              private toastr: ToastrMessageService) {
  }

  ngOnInit() {

    this.getAppStatus();
  }

  getAppStatus(): void {
    this.apiService.getStatus().subscribe((status) => this.isAppStarted = !status);
  }


}
