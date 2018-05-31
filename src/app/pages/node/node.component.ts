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
      value: 0
    },
    {
      label: 'Join the network as a peer node',
      value: 1
    }
  ];

  public selectNodeAction = [
    {
      label: 'Start with an empty state - Genesis',
      value: 0
    },
    {
      label: 'Restore blockchain - Local folder',
      value: 1
    }
  ];

  public selectDistribution = [
    {
      label: 'Automatic distribution',
      value: 0
    },
    {
      label: 'Manual distribution',
      value: 1
    }
  ];

  public selectedNodeType: any;
  public selectedNodeAction: any;
  public selectedDistributon: number;

  public instanceName: string;
  public instanceIp = '127.0.0.1';
  public instancePort = 1234;
  public instanceGenesisCoins = 21000000;
  public instanceRestorePath = '';
  public instanceBlockchainPath = '';
  public instanceNodeDistribution: string;

  public privateKey: string;
  public publicKey: string;
  public isReadonly = true;

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

  generatePrivateKey() {
    console.log('generate private key');
    this.isReadonly = true;
  }

  manualPrivateKey() {
    console.log('manual pk');
    this.isReadonly = false;
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
}
