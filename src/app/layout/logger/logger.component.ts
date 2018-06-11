import { Component, OnInit } from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit {
  private url = environment.api + environment.ws;

  public logger = '';

  constructor() {
  }

  ngOnInit() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {

    const that = this;
    const newLine = '\n';

    const stompClient = Stomp.over(new SockJS(this.url));
    stompClient.connect({}, function (frame) {

      stompClient.subscribe('/topic/public', (message) => {
        if (message.body) {
          that.logger = that.logger + message.body + newLine;
        }
      });
    });
  }

}
