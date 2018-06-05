import { Injectable } from '@angular/core';

// import * as SockJS from 'sockjs-client';
// import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public url = 'http://localhost:8080/socket';

  constructor() {
  }

  // Open connection with the back-end socket
  public connect() {
    // const socket = new SockJs(this.url);

    // const stompClient = Stomp.over(socket);

    // return stompClient;
  }
}
