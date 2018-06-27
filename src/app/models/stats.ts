export class Stats {
  activeNodes: string;
  nrShards: string;
  averageRoundTime: string;
  liveRoundTime: string;
  totalNrProcessedTransactions: string;
  averageNrTxPerBlock: string;
  liveTps: string;
  peakTps: string;
  averageTps: string;
  liveNrTransactionsPerBlock: string;

  public static getDefault() {
    const stats = new Stats();
    stats.activeNodes = '0';
    stats.nrShards = '0';
    stats.averageRoundTime = '0';
    stats.liveRoundTime = '0';
    stats.averageNrTxPerBlock = '0';
    stats.liveTps = '0';
    stats.peakTps = '0';
    stats.averageTps = '0';
    stats.liveNrTransactionsPerBlock = '0';
    stats.totalNrProcessedTransactions = '0';
    return stats;
  }
}
