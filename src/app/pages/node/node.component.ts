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
  public isKeyGenerated = false;
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
              private toastr: ToastrMessageService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.loadingService.show();

    this.node = this.nodeDataService.load('main');
    this.step = this.node.step;
    this.getNodeStatus();

    this.nodeDataService.nodeStatus.subscribe(status => {
      this.isNodeStarted = status;

      const toggleNodeButtonText = (status) ? 'Stop' : 'Start';
      this.setupButtonText('toggleButtonText', toggleNodeButtonText);
    });

    this.loadingService.hideDelay(500);
  }

  getNodeStatus(): void {
    this.apiService.getStatus().subscribe((status) => {

      if (this.isNodeStarted !== status) {
        this.nodeDataService.set(status);
      }

      if (status) {
        this.step = 3;
        this.wizard.navigation.goToStep(this.step);
      }
    });
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

  generatePublicKeyAndPrivateKey(key?) {
    const payloadKey = (key) ? key : '';

    this.apiService.generatePublicKeyAndPrivateKey(payloadKey).subscribe((keys) => {
      if (keys) {
        this.isKeyGenerated = true;

        this.apiService.getShardOfAddress(keys.publicKey).subscribe((res) => {
          this.node.privateKey = keys.privateKey;
          this.node.publicKey = keys.publicKey;

          this.node.allocatedShard = res;
        });
      }

      this.onChange();
    });
  }

  resetPeer() {
    this.node.peerIp = '';
    this.node.peerPort = '';
  }

  canGoNext(step) {
    // switch (step) {
    //   case 1: {
    //     return (this.node.instanceName !== '' &&
    //       this.node.instanceIp !== '' &&
    //       this.node.instancePort
    //     );
    //   }
    //   case 2: {
    //     if (this.node.selectedNodeType === 2) {
    //       return true;
    //     }
    //
    //     return (this.node.selectedNodeType);
    //   }
    //   case 3: {
    //     return this.node.selectedNodeType === 1;
    //   }
    //   case 4: {
    //     return (this.node.privateKey !== '' && this.node.publicKey !== '');
    //   }
    //   default: {
    //     return false;
    //   }
    // }

    return true;
  }

  onStepEnter(event) {
    const currentStep = (this.wizard && this.wizard.model && this.wizard.model.currentStepIndex) ? this.wizard.model.currentStepIndex : 0;
    this.node.step = currentStep;
    this.onChange();
  }

  getDefaultStep(): number {
    return (this.step) ? this.step : 0;
  }

  onBegin(event) {
    this.generatePublicKeyAndPrivateKey();
  }

  startNode() {
    this.loadingService.show();
    this.nodeDataService.save('start', this.node);

    const nodeName = this.node.instanceName;
    const port = this.node.instancePort;
    const privateKey = this.node.privateKey;

    const isSeedNode = this.node.selectedNodeType === 1;

    const masterPeerPort = (isSeedNode) ? this.node.instancePort : this.node.peerPort;
    const masterPeerIpAddress = (isSeedNode) ? this.node.instanceIp : this.node.peerIp;

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

        this.nodeDataService.set(true);

      } else {
        this.toastr.show({
          title: 'Fail',
          message: `Operation has failed`,
        }, 'error');

        this.nodeDataService.set(false);
      }

      this.loadingService.hideDelay();
    });
  }

  stopNode() {
    this.loadingService.show();

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

      this.nodeDataService.set(false);
      this.loadingService.hide();
    });
  }

  setupButtonText(field, value): void {
    this[field] = value;
  }

  toggleNode() {
    if (this.isNodeStarted) {
      this.stopNode();

      return;
    }

    this.startNode();
  }

  isNavigationDisabled() {
    return this.wizard.model.currentStepIndex === 3;
  }
}
