export enum TransactionType {
  Deposit = 'deposit',
  Withdrawal = 'withdrawal',
}

export enum TransactionStatus {
  Created = 'created', // transaction created in DB
  ReCreated = 're-created', // transaction created in DB again after encounter an error
  Queued = 'queued', // sent to processing queue
  Processing = 'processing', // picked up by worker/job, processing started
  Success = 'success', // transaction executed as intended
  Failed = 'failed', // transaction failed to execute
  Completed = 'completed', // processing finished as intended
}

export enum TransferStatus {
  NotInitiated = 'not-initiated', // Transaction preparing to broadcast
  Invalid = 'invalid', // Transaction cannot be broadcasted
  Pending = 'pending', // Transaction broadcasted and currently in mempool, waiting to be included in block
  Executed = 'executed', // Transaction successfully executed
  Reverted = 'reverted', // Transaction reverted during execution
  Canceled = 'canceled', // Transaction overwritten by another empty transaction
  NotProcessed = 'not-processed', // Transaction execution result is unknown (success, fail, pending), so logic that require knowledge about tx state not applied
}

