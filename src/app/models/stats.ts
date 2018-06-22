export class Stats {
  tps: string;
  activeNodeNr: string;
  shardsNr: string;
  averageRoundTime: string;
  averageTxBlock: string;

  public static getDefault() {
    const stats = new Stats();

    stats.tps = '2500';
    stats.activeNodeNr = '125';
    stats.shardsNr = '3';
    stats.averageRoundTime = '5';
    stats.averageTxBlock = '1000';

    return stats;
  }
}
