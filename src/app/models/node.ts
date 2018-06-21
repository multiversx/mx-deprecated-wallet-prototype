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
  allocatedShard: any;
  selectedBlockchainPath: any;

  public static getDefault() {
    const node = new Node();

    node.selectedNodeType = 2;
    node.selectedNodeAction = 1;
    node.selectedPKSource = 2;
    node.instanceName = `Elrond Instance - test - ${UUID.UUID()}`;
    node.instanceIp = '127.0.0.1';
    node.instancePort = '31201';
    node.instanceGenesisCoins = 21000000000;
    node.instanceRestorePath = '';
    node.instanceBlockchainPath = '';
    node.privateKey = '';
    node.publicKey = '';
    node.peerIp = '0.0.0.0';
    node.peerPort = '31201';
    node.peerTable = [
      {
        ip: '127.0.0.1',
        port: '31201',
        status: true,
        delete: false
      }
    ];
    node.step = 0;
    node.allocatedShard = 1;
    node.selectedBlockchainPath = 1;
    return node;
  }

}
