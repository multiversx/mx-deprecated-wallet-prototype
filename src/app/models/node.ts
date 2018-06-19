import { UUID } from 'angular2-uuid';

export class Node {
  selectedNodeType: any;
  selectedNodeAction: any;
  selectedPKSource: any;
  instanceName: string;
  instanceIp: string;
  instancePort: any;
  instanceGenesisCoins: any;
  instanceRestorePath: string;
  instanceBlockchainPath: string;
  privateKey: string;
  publicKey: string;
  peerIp: string;
  peerPort: string;
  peerTable: any[];
  step: number;
  selectedBlockchainPath: any;

  public static getDefault() {
    const node = new Node();

    node.selectedNodeType = null;
    node.selectedNodeAction = null;
    node.selectedPKSource = 2;
    node.instanceName = `Elrond Instance - test - ${UUID.UUID()}`;
    node.instanceIp = '127.0.0.1';
    node.instancePort = '31201';
    node.instanceGenesisCoins = 21000000;
    node.instanceRestorePath = '';
    node.instanceBlockchainPath = '';
    node.privateKey = '';
    node.publicKey = '';
    node.peerIp = '';
    node.peerPort = '';
    node.peerTable = [
      {
        ip: '127.0.0.1',
        port: '31201',
        status: true
      }
    ];
    node.step = 0;
    node.selectedBlockchainPath = 1;
    return node;
  }

}
