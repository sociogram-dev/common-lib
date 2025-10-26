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

/**
 * Primary user account types.
 * Each user has one or more account that represent their overall funds for specific roles in the platform.
 */
export enum AccountType {
  /** General-purpose internal balance used for deposits, withdrawals, transfers, other internal platform operations */
  Main = 'main',

  /** Balance for advertisers — used to fund ad campaigns. */
  Advertiser = 'advertiser',

  /** Balance for publishers — used to fund ad units. */
  Publisher = 'publisher',

  /** Balance for developers — used to fund mini-apps. */
  Developer = 'developer',
}

/**
 * Context-specific (sub) balances linked to primary user balances.
 * These represent funds that are isolated per context (e.g. campaign, ad unit, mini-app).
 */
export enum ContextAccountType {
  /** Balance for an Ad Unit — used to accumulate ad revenue from impressions, clicks, or engagement. */
  AdUnit = 'ad-unit',

  /** Balance for a Campaign — used to allocate advertiser funds and track ad spending. */
  Campaign = 'campaign',

  /** Balance for a Mini App — used to store or distribute funds related to in-app transactions or rewards. */
  MiniApp = 'mini-app',
}

/**
 * Sum of all amounts in an user accounts depending on the balance context.
 */
export enum TotalBalanceType {
  Accounts = 'accounts', // sum of all available balances
  Earned = 'earned', // sum of all user earnings
  Spent = 'spent', // sum of all user spent
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
  Refund = 'campaign.refund',
  Impression = 'campaign.impression' // viewed campaign on publisher site
}

export enum AdUnitOperation {
  Deposit = 'ad-unit.deposit',
  Withdraw = 'ad-unit.withdraw',
  Earn = 'ad-unit.earn',
}

export enum PlatformOperation {
  Reward = 'platform.reward',
  Refund = 'platform.refund',
  AdsFee = 'platform.ads-fee',
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
