import { Component, OnInit, ViewChild } from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { environment } from '../../../environments/environment';
import { NodeDataService } from '../../services/node-data.service';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit {
  private url = environment.api + environment.ws;

  public apiLoggs = [];
  public logWindowSize = 10000;

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  constructor(private nodeDataService: NodeDataService) {
  }

  ngOnInit() {
    this.initializeWebSocketConnection();
  }

  addLog(message) {
    if (this.apiLoggs.length > this.logWindowSize) {
      this.apiLoggs.shift();
    }

    this.apiLoggs.push(message);
    this.scrollToBottom();
  }

  public scrollToBottom(): void {
    this.componentRef.directiveRef.scrollToBottom();
  }

  initializeWebSocketConnection() {

    const that = this;
    const newLine = '\n';

    const stompClient = Stomp.over(new SockJS(this.url));
    stompClient.connect({}, function (frame) {

      stompClient.subscribe('/topic/public', (message) => {
        if (message.body) {
          that.addLog(message.body + newLine);
        }
      });
    });
  }

}
