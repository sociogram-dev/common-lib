export enum TransactionType {
  Deposit = 'deposit',
  Withdrawal = 'withdrawal',
}

export enum TransactionStatus {
  Created = 'created', // register tx for processor
  Processing = 'processing', // sent to job
  Queued = 'queued', // start to process by job
  Pending = 'pending', // tx in blockchain pool
  Success = 'success',
  Failed = 'failed',
  Canceled = 'canceled',
}
