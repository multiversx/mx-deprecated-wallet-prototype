import { UUID } from 'angular2-uuid';

export class Node {
  selectedNodeType: any;
  selectedPKSource: any;
  instanceName: string;
  instanceIp: string;
  instancePort: any;
  privateKey: string;
  publicKey: string;
  peerIp: string;
  peerPort: string;
  step: number;
  allocatedShard: any;

  public static getDefault() {
    const node = new Node();

    node.selectedNodeType = 2;
    node.selectedPKSource = 2;
    node.instanceName = `Elrond Instance - test - ${UUID.UUID()}`;
    node.instanceIp = '127.0.0.1';
    node.instancePort = '31201';
    node.privateKey = '';
    node.publicKey = '';
    node.peerIp = '0.0.0.0';
    node.peerPort = '31201';
    node.step = 0;
    node.allocatedShard = null;
    return node;
  }
}
