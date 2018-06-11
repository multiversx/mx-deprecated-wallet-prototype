import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy, ViewContainerRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NodeDataService } from '../../services/node-data.service';
import { Node } from '../../models/node';

import { Observable, Subscription } from 'rxjs';
import { ToastrMessageService } from '../../services/toastr.service';

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

export class NodeComponent implements OnInit, AfterViewInit, OnDestroy {
  public node: Node;
  private step;

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

  // Subscription status
  public subscribed: boolean;

  // Array of historic message (bodies)
  public mq: Array<string> = [];

  // A count of messages received
  public count = 0;

  private _counter = 1;

  constructor(private apiService: ApiService,
              private nodeDataService: NodeDataService,
              private changeDetectionRef: ChangeDetectorRef,
              private toastr: ToastrMessageService) {
  }

  ngOnInit() {
    this.node = this.nodeDataService.load('main');
    this.step = this.node.step;
  }

  ngAfterViewInit(): void {
    this.changeDetectionRef.detectChanges();
  }

  onChange() {
    this.nodeDataService.save('main', this.node);
  }

  onChangeKeys() {
    const value = this.node.selectedPKSource;

    if (value === 1) {
      this.node.publicKey = '';
      this.node.privateKey = '';
    }

    this.onChange();
  }

  getSelectLabel(field, value) {
    return (this[field] instanceof Array) ?
      this[field].filter(item => item.value === this.node[value]).map(item => item.label) :
      this[value];
  }

  ping() {
    const url = `ipAddress=${this.node.instanceIp}&port=${this.node.instancePort}`;

    const error = {
      title: 'Error',
      message: 'Please change your IP & Port!',
    };

    const errorPort = {
      title: 'Error',
      message: 'Please change your Port!',
    };

    this.apiService.ping(url).subscribe(result => {

      console.log(result);

      const {reachablePing, reachablePort, reponseTimeMs} = result;

      const success = {
        title: 'Success',
        message: `Your IP & Port are reachable - response time: ${reponseTimeMs}ms`,
      };

      if (reachablePing && reachablePort) {
        this.toastr.show(success);
      } else {
        this.toastr.show(error, 'error');
      }
    });
  }

  generateKeys() {

    this.apiService.generateKeys().subscribe((keys) => {
      this.node.privateKey = keys.privateKey;
      this.node.publicKey = keys.publicKey;
      this.onChange();
    });


  }

  generatePublickKey() {
    this.apiService.generatePublicKey(this.node.privateKey).subscribe((keys) => {
      console.log(keys);
      this.node.privateKey = keys.privateKey;
      this.node.publicKey = keys.publicKey;
      this.onChange();
    });
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
          this.node.instancePort // &&
          // this.node.instanceBlockchainPath
        );
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
    const currentStep = (this.step) ? this.step : 0;
    return currentStep;
  }

  ngOnDestroy() {
    // this.unsubscribe();
  }

  startNode() {
    this.nodeDataService.save('start', this.node);

    const nodeName = this.node.instanceName;
    const port = this.node.instancePort;
    let masterPeerPort = this.node.peerPort;
    let masterPeerIpAddress = this.node.peerIp;
    const privateKey = this.node.privateKey;

    const isSeedNode = this.node.selectedNodeType === 1;
    if (isSeedNode) {
      masterPeerPort = this.node.instancePort;
      masterPeerIpAddress = this.node.instanceIp;
    }


    this.apiService.startNode(
      nodeName,
      port,
      masterPeerPort,
      masterPeerIpAddress,
      privateKey
    ).subscribe(result => {
      if (result) {
        this.toastr.show({
          title: 'Success',
          message: `Operation was finished with success`,
        });
      } else {
        this.toastr.show({
          title: 'Fail',
          message: `Operation has failed`,
        }, 'error');
      }
    });
  }


  stopNode() {
    this.apiService.stopNode().subscribe(result => {
      if (result) {
        this.toastr.show({
          title: 'Success',
          message: `Operation was finished with success`,
        });
      } else {
        this.toastr.show({
          title: 'Fail',
          message: `Operation has failed`,
        }, 'error');
      }
    });
  }
}
