import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NodeDataService } from '../../services/node-data.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  public isAppStarted = false;
  public isNodeStarted = false;

  constructor(private apiService: ApiService, private nodeDataService: NodeDataService) {
  }

  ngOnInit() {
    this.nodeDataService.nodeStatus.subscribe((status) => this.isNodeStarted = status);

    this.getAppStatus();
  }

  getAppStatus(): void {
    this.apiService.getAppStatus().subscribe((status) => this.isAppStarted = status);
  }
}
