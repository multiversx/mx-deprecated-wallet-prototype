import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NodeDataService } from '../../services/node-data.service';
import { WizardComponent } from 'angular-archwizard';
import { Observable, Subscription } from 'rxjs';

import { Node } from '../../models/node';
import { ToastrMessageService } from '../../services/toastr.service';
import { LoadingService } from '../../services/loading.service';

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
  private step;

  public isNodeStarted = false;
  public node: Node;
  public isDefaultConfiguration = false;
  public toggleButtonText = 'Start';

  @ViewChild('WizardComponent') public wizard: WizardComponent;

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

  public selectBlockchainPath = [
    {
      label: 'Default (location of running app)',
      value: 1
    },
    {
      label: 'Choose a local folder',
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
              private toastr: ToastrMessageService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.node = this.nodeDataService.load('main');
    this.step = this.node.step;
  }

  ngAfterViewInit(): void {
    this.changeDetectionRef.detectChanges();
  }

  clearLocalStorage() {
    this.nodeDataService.clear('main');
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

  pingLocal() {
    const url = `ipAddress=${this.node.instanceIp}&port=${this.node.instancePort}`;

    const error = {
      title: 'Error',
      message: 'Provided IP is not reachable.',
    };

    const errorPort = {
      title: 'Error',
      message: 'Your Port is busy.',
    };

    this.apiService.ping(url).subscribe(result => {
      const {reachablePing, reachablePort, reponseTimeMs} = result;

      const success = {
        title: 'Success',
        message: `Your IP & Port are reachable - response time: ${reponseTimeMs}ms`,
      };

      if (!reachablePing) {
        this.toastr.show(error, 'error');
      } else {
        if (reachablePort) {
          this.toastr.show(errorPort, 'error');
        } else {
          this.toastr.show(success);
        }
      }
    });
  }

  pingPeer() {
    const url = `ipAddress=${this.node.peerIp}&port=${this.node.peerPort}`;

    const error = {
      title: 'Error',
      message: 'Peer IP is not reachable',
    };

    const errorPort = {
      title: 'Error',
      message: 'Peer Port is not open',
    };

    this.apiService.ping(url).subscribe(result => {
      const {reachablePing, reachablePort, reponseTimeMs} = result;

      const success = {
        title: 'Success',
        message: `Peer IP & Port are reachable - response time: ${reponseTimeMs}ms`,
      };

      if (!reachablePing) {
        this.toastr.show(error, 'error');
      } else {
        if (!reachablePort) {
          this.toastr.show(errorPort, 'error');
        } else {
          this.toastr.show(success);
        }
      }
    });
  }

  generateKeys(callback?: (step) => void, index?) {
    this.apiService.generateKeys().subscribe((keys) => {
      this.node.privateKey = keys.privateKey;
      this.node.publicKey = keys.publicKey;
      this.onChange();

      if (callback) {
        callback(index);
      }
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
      status,
      delete: true
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

        return (this.node.selectedNodeType && this.node.selectedNodeAction);
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

  getDefaultStep(): number {
    return (this.step) ? this.step : 0;
  }

  finalizeDefaultConfiguration(event) {
    const index = 5;
    this.isDefaultConfiguration = true;
    this.generateKeys(this.navigateToStep, index);
  }

  onAdvancedPreFinalize() {
  }

  startNode() {
    this.loadingService.show();
    this.nodeDataService.save('start', this.node);
    this.nodeDataService.clear('main');


    const nodeName = this.node.instanceName;
    const port = this.node.instancePort;
    const privateKey = this.node.privateKey;

    const peerIp = this.node.peerTable[0].ip;
    const peerPort = this.node.peerTable[0].port;

    const isSeedNode = this.node.selectedNodeType === 1;

    const masterPeerPort = (isSeedNode) ? this.node.instancePort : peerPort;
    const masterPeerIpAddress = (isSeedNode) ? this.node.instanceIp : peerIp;

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

        this.nodeDataService.start();
      } else {
        this.toastr.show({
          title: 'Fail',
          message: `Operation has failed`,
        }, 'error');

        this.setupButtonText('toggleButtonText', 'Start');
        this.isNodeStarted = false;
        this.nodeDataService.stop();
      }

      this.loadingService.hide();
    });
  }

  stopNode() {
    this.loadingService.show();
    this.nodeDataService.stop();

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

      this.loadingService.hide();
    });
  }

  setupButtonText(field, value): void {
    this[field] = value;
  }

  toggleNode() {
    const startText = 'Start';
    const stopText = 'Stop';

    if (this.isNodeStarted) {
      this.setupButtonText('toggleButtonText', 'Start');
      this.stopNode();
    } else {
      this.setupButtonText('toggleButtonText', 'Stop');
      this.startNode();
    }

    this.isNodeStarted = !this.isNodeStarted;
  }

  navigateToStep = (index) => {
    this.wizard.navigation.goToStep(index);
  };
}
