import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';

export interface PeerList {
  ip: string;
  port: string;
  status: boolean;
}

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})

export class NodeComponent implements OnInit {
  private UUID;

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
      label: 'I have a private key',
      value: 1
    },
    {
      label: 'Generate a new private key',
      value: 2
    }
  ];

  public selectedNodeType: any;
  public selectedNodeAction: any;
  public selectedDistributon: number;
  public selectedPKSource = 2;

  public instanceName: string;
  public instanceIp = '127.0.0.1';
  public instancePort = 1234;
  public instanceGenesisCoins = 21000000;
  public instanceRestorePath = '';
  public instanceBlockchainPath = '';
  public instanceNodeDistribution: string;

  public privateKey = '';
  public publicKey = ''
  public isLoading = false;

  public peerIp: string;
  public peerPort: string;
  public peerTable: PeerList[] = [];
  public instanceGenerateTransaction = false;

  constructor() {
    this.UUID = UUID.UUID();
  }

  ngOnInit() {
    // Inits
    this.instanceName = `Elrond Instance ${this.UUID}`;
  }

  checkInstance() {
    console.log('check ip & port');
  }

  generateKeys() {
    this.privateKey = UUID.UUID();
    this.publicKey = UUID.UUID();
  }

  generatePublickKey() {
    console.log('manual pk');
  }

  testPeer(): boolean {
    console.log('test peer');
    return true;
  }

  resetPeer() {
    this.peerIp = '';
    this.peerPort = '';
  }

  addPeer() {
    const ip = this.peerIp;
    const port = this.peerPort;
    const status = true;
    const payload = {
      ip,
      port,
      status
    };

    if (payload) {
      this.peerTable.push(payload);
      this.resetPeer();
    }
  }

  deletePeer(index) {
    this.peerTable.splice(index, 1);
  }

  onChangeBlockchain(event) {
    this.instanceBlockchainPath = event.target.files[0].path;
  }

  onChangePath(event) {
    this.instanceRestorePath = event.target.files[0].path;
  }

  canGoNext(step) {
    switch (step) {
      case 1: {
        return (this.instanceName !== '' && this.instanceIp !== '' && this.instancePort && this.instanceBlockchainPath);
      }
      case 2: {
        if (this.selectedNodeType === 2) {
          return true;
        }

        return (this.selectedNodeType && this.selectedNodeAction &&
          (this.selectedNodeAction === 2 && this.instanceRestorePath || this.selectedDistributon === 2 ||
            (this.selectedDistributon === 1 && this.instanceNodeDistribution)));
      }
      case 3: {
        if (this.selectedNodeType === 1) {
          return true;
        }

        return !(this.peerTable);
      }
      case 4: {
        return (this.privateKey !== '' && this.publicKey !== '');
      }
      default: {
        return false;
      }
    }
  }
}
