import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { ApiService } from '../../services/api.service';
import { NodeDataService } from '../../services/node-data.service';
import { Node } from '../../models/node';

import { Observable ,  Subscription } from 'rxjs';
import {Message} from '@stomp/stompjs';
import {StompService} from '@stomp/ng2-stompjs';

export interface PeerList {
  ip: string;
  port: number;
  status: boolean;
}

export interface Wizard {
  model: {
    currentStepIndex: number;
  };
}

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})

export class NodeComponent implements OnInit, AfterViewInit {
  private UUID;
  public node: Node;

  @ViewChild('wizard') public wizard: Wizard;

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

  public selectNodeAction = [
    {
      label: 'Start with an empty state - Genesis',
      value: 1
    },
    {
      label: 'Restore blockchain - Local folder',
      value: 2
    }
  ];

  public selectDistribution = [
    {
      label: 'Automatic distribution',
      value: 1
    },
    {
      label: 'Manual distribution',
      value: 2
    }
  ];

  public selectPrivateKeySource = [
    {
      label: 'Generate a public key from a given private key',
      value: 1
    },
    {
      label: 'Generate a new set of keys',
      value: 2
    }
  ];

  // Stream of messages
  private subscription: Subscription;
  public messages: Observable<Message>;

  // Subscription status
  public subscribed: boolean;

  // Array of historic message (bodies)
  public mq: Array<string> = [];

  // A count of messages received
  public count = 0;

  private _counter = 1;

  constructor(private apiService: ApiService,
              private _stompService: StompService,
              private nodeDataService: NodeDataService,
              private changeDetectionRef: ChangeDetectorRef) {
    this.UUID = UUID.UUID();
  }

  ngAfterViewInit(): void {
    this.changeDetectionRef.detectChanges();
  }

  public subscribe() {
    if (this.subscribed) {
      return;
    }

    // Stream of messages
    this.messages = this._stompService.subscribe('/topic/ng-demo-sub');

    // Subscribe a function to be run on_next message
    this.subscription = this.messages.subscribe(this.on_next);

    this.subscribed = true;
  }

  /** Consume a message from the _stompService */
  public on_next = (message: Message) => {

    // Store message in "historic messages" queue
    this.mq.push(message.body + '\n');

    // Count it
    this.count++;

    // Log it to the console
    console.log(message);
  }

  public unsubscribe() {
    if (!this.subscribed) {
      return;
    }

    // This will internally unsubscribe from Stomp Broker
    // There are two subscriptions - one created explicitly, the other created in the template by use of 'async'
    this.subscription.unsubscribe();
    this.subscription = null;
    this.messages = null;

    this.subscribed = false;
  }


  ngOnInit() {
    this.node = this.nodeDataService.load();

    this.subscribed = false;

    // Store local reference to Observable
    // for use with template ( | async )
   // this.subscribe();


  }

  onChange() {
    this.nodeDataService.save(this.node);
  }

  getSelectLabel(field, value) {
    return (this[field] instanceof Array) ?
      this[field].filter(item => item.value === this.node[value]).map(item => item.label) :
      this[value];
  }

  checkInstance() {
    const payload = {
      ip: this.node.instanceIp,
      port: this.node.instancePort
    };

    this.apiService.post(payload).subscribe(result => {
      console.log('API instance result: ', result);
    });
  }

  generateKeys() {
    this.node.privateKey = UUID.UUID();
    this.node.publicKey = UUID.UUID();
    this.onChange();
  }

  generatePublickKey() {
    console.log('manual pk');
  }

  testPeer(): boolean {
    console.log('test peer');
    return true;
  }

  resetPeer() {
    this.node.peerIp = '';
    this.node.peerPort = '';
  }

  addPeer() {
    const ip = this.node.peerIp;
    const port = this.node.peerPort;
    const status = true;
    const payload = {
      ip,
      port,
      status
    };

    if (ip && port) {
      this.node.peerTable.push(payload);
      this.onChange();
      this.resetPeer();
    }
  }

  deletePeer(index) {
    this.node.peerTable.splice(index, 1);
  }

  onChangeBlockchain(event) {
    this.node.instanceBlockchainPath = event.target.files[0].path;
    this.onChange();
  }

  onChangePath(event) {
    this.node.instanceRestorePath = event.target.files[0].path;
    this.onChange();
  }

  canGoNext(step) {
    switch (step) {
      case 1: {
        return (this.node.instanceName !== '' &&
          this.node.instanceIp !== '' &&
          this.node.instancePort &&
          this.node.instanceBlockchainPath);
      }
      case 2: {
        if (this.node.selectedNodeType === 2) {
          return true;
        }

        return (this.node.selectedNodeType && this.node.selectedNodeAction &&
          (this.node.selectedNodeAction === 2 && this.node.instanceRestorePath || this.node.selectedDistributon === 2 ||
            (this.node.selectedDistributon === 1 && this.node.instanceNodeDistribution)));
      }
      case 3: {
        if (this.node.selectedNodeType === 1) {
          return true;
        }

        return (this.node.peerTable.length > 0);
      }
      case 4: {
        return (this.node.privateKey !== '' && this.node.publicKey !== '');
      }
      default: {
        return false;
      }
    }
  }

  onStepEnter(event) {
    const currentStep = (this.wizard && this.wizard.model && this.wizard.model.currentStepIndex) ? this.wizard.model.currentStepIndex : 0;
    this.node.step = currentStep;
    this.onChange();
  }

  getDefaultSetp(): number {
    return this.node.step;
  }
}
