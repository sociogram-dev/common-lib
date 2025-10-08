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

export enum TreasureOperation {
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
  | TreasureOperation
  | PlatformOperation
  | MiniAppOperation
  | RewardPoolOperation
  | ReactionOperation
  | GiveawayOperation
  | MemepadOperation
  | ReferralOperation
  | TransferOperation

export const OperationMessageMap: { [key in TransactionDirection]: Map<OperationType, string> } = {
  [TransactionDirection.Credit]: new Map<OperationType, string>([
    // Treasures
    [ TreasureOperation.Deposit, 'Deposit' ],

    // Platform
    [ PlatformOperation.Reward, 'Funds received from Sociogram' ],
    [ PlatformOperation.Refund, 'Your reward for Trading/Referral Competition' ],

    // Reward pool
    [ RewardPoolOperation.Earn, 'You received a reward from post' ],

    // Giveaway
    [ GiveawayOperation.Refund, 'Funds from Giveaway refunded to the creator' ],
    [ GiveawayOperation.Winner, 'Funds received from Giveaway' ],

    // Reaction
    [ ReactionOperation.GotTips, 'You received a reward from tips' ],
    [ ReactionOperation.DepositRewardPool, 'Deposit to reward pool from tips' ],

    // Transfer
    [ TransferOperation.In, 'Transfer funds to main balance' ],

    // Mini-app
    [ MiniAppOperation.Sell, 'You receive funds from Mini-App' ],
    [ MiniAppOperation.Buy, 'Funds received from user' ],
    [ MiniAppOperation.Purchase, 'You receive funds from Mini-App' ],

    // Memepad
    [ MemepadOperation.TokenListed, 'Funds received from Sociogram for successfully listing the token' ],
    [ MemepadOperation.CatchMeme, 'Funds received from Sociogram for caught Doge Pumper' ],

    // Referral
    [ ReferralOperation.Reward, 'Congrats, you won $#amount in Referral Competition!' ],
  ]),

  [TransactionDirection.Debit]: new Map<OperationType, string>([
    // Treasures
    [ TreasureOperation.Withdrawal, 'Withdraw' ],

    // Reward pool
    [ RewardPoolOperation.Deposit, 'Deposit to reward pool' ],
    [ MemepadOperation.DepositRewardPool, 'Deposit to reward pool from trade' ],

    // Giveaway
    [ GiveawayOperation.Create, 'Funds deducted for creation of Giveaway' ],

    // Reaction
    [ ReactionOperation.GiveTips, 'You give tips' ],

    // Transfer
    [ TransferOperation.Out, 'Transfer funds to trading balance' ],

    // Mini-app
    [ MiniAppOperation.Purchase, 'Purchase in Mini-App' ],
    [ MiniAppOperation.Sell, 'Funds transferred to user' ],
    [ MiniAppOperation.Buy, 'Payment to Mini-App' ],
  ]),
}


export enum TransactionSource {
  Internal = 'internal',
  OnChain = 'onchain',
}
