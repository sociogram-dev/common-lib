export enum BalanceType {
  Main = 'main', // main internal balance
  Trading = 'trading',
  MiniApp = 'mini-app',
  Bot = 'bot',
  Advertiser = 'advertiser',
  Publisher = 'publisher',
  Campaign = 'campaign'
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
  Sell = 'mini-app.sell',
  Buy = 'mini-app.buy',
  Purchase = 'mini-app.purchase',
}

export enum PlatformOperation {
  Reward = 'platform.reward',
  Refund = 'platform.refund',
}

export enum TransferOperation {
  Out = 'balance.transfer-out',
  In = 'balance.transfer-in',
}

export enum TreasureType {
  Deposit = 'treasure.deposit',
  Withdrawal = 'treasure.withdrawal',
}

export enum RewardPoolOperation {
  Deposit = 'reward-pool.deposit',
  Earn = 'reward-pool.earn'
}

export enum ReactionOperation {
  Leave = 'reaction.leave',
  GiveTips = 'reaction.give-tips',
  GotTips = 'reaction.got-tips',
  DepositRewardPool = 'reaction.deposit-reward-pool',
}

export enum MemepadOperation {
  TokenListed = 'memepad.token-listed',
  CatchMeme = 'memepad.catch-meme',
  DepositRewardPool = 'memepad.deposit-reward-pool',
}

export enum ReferralOperation {
  Reward = 'referral.reward',
}

export type OperationType =
  | TreasureType
  | PlatformOperation
  | MiniAppOperation
  | RewardPoolOperation
  | ReactionOperation
  | GiveawayOperation
  | MemepadOperation
  | ReferralOperation
  | TransferOperation
