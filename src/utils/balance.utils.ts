export enum TransactionDirection {
  /**
   * Funds are added to the balance (replenishment, winnings, receiving rewards)
   * @type {TransactionDirection.Credit}
   */
  Credit = 'credit',

  /**
   * Funds are debited from the balance (withdrawal, expenses, transfers)
   * @type {TransactionDirection.Debit}
   */
  Debit = 'debit',
}

export enum BalanceType {
  Main = 'main', // main internal balance
  Advertiser = 'advertiser',
  Publisher = 'publisher',
  Developer = 'developer',
}

export enum ContextBalanceType {
  AdUnit = 'adunit',
  Campaign = 'campaign',
  MiniApp = 'mini-app',
}

export enum BalanceStatus {
  Pending = 'pending',
  Failed = 'failed',
  Success = 'success',
}

export enum GiveawayOperation {
  Create = 'giveaway.create',
  Refund = 'giveaway.refund',
  Winner = 'giveaway.winner',
}

export enum MiniAppOperation {
  Deposit = 'mini-app.deposit',
  Withdraw = 'mini-app.withdraw',
  Sell = 'mini-app.sell',
  Buy = 'mini-app.buy',
  Purchase = 'mini-app.purchase',
}

export enum CampaignOperation {
  Deposit = 'campaign.deposit',
  Withdraw = 'campaign.withdraw',
  Spend = 'campaign.spend'
}

export enum AdUnitOperation {
  Deposit = 'adunit.deposit',
  Withdraw = 'adunit.withdraw',
  Earn = 'adunit.earn',
}

export enum PlatformOperation {
  Reward = 'platform.reward',
  Refund = 'platform.refund',
}

export enum TransferOperation {
  Out = 'balance.transfer-out',
  In = 'balance.transfer-in',
}

export enum TreasureOperation {
  Deposit = 'treasure.deposit',
  Withdrawal = 'treasure.withdrawal',
}

export enum RewardPoolOperation {
  Deposit = 'reward-pool.deposit',
  Earn = 'reward-pool.earn'
}

export enum ReactionOperation {
  GiveTips = 'reaction.give-tips',
  GotTips = 'reaction.got-tips',
  DepositRewardPool = 'reaction.deposit-reward-pool',
}

/** @deprecated */
export enum MemepadOperation {
  TokenListed = 'memepad.token-listed',
  CatchMeme = 'memepad.catch-meme',
  DepositRewardPool = 'memepad.deposit-reward-pool',
}

export enum ReferralOperation {
  Reward = 'referral.reward',
}

export type OperationType = TreasureOperation
  | PlatformOperation
  | MiniAppOperation
  | CampaignOperation
  | AdUnitOperation
  | RewardPoolOperation
  | ReactionOperation
  | GiveawayOperation
  | MemepadOperation
  | ReferralOperation
  | TransferOperation

export enum SendOperation {
  GiveTips = 'send.give-tips',
}

export const SendOperationProfile = new Map<SendOperation, { from: OperationType, to: OperationType }>([
  [ SendOperation.GiveTips, { from: ReactionOperation.GiveTips, to: ReactionOperation.GotTips } ],
])
