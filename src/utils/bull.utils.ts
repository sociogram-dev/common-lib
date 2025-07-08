/**
 * Bull queue contexts for different application domains.
 * Each context represents a separate queue for processing specific types of jobs.
 */
export enum BullContext {
  Analytic = 'analytic',
  Giveaway = 'giveaway',
  Twitter = 'tweeter',
  Notification = 'notification',
  Publication = 'publication',
  RewardPool = 'reward-pool',
  Comment = 'comment',
  Transaction = 'transaction',
  User = 'user',
  UserServices = 'user-services',
  Reaction = 'reaction',
  Slack = 'slack',
  RatingSystem = 'rating-system',
  Trades = 'trades',
  Websocket = 'websocket',
}

/**
 * Job names for analytics processing.
 */
enum AnalyticJob {
  /** Handle source earned amount. */
  Earned = `${BullContext.Analytic}.earned`,

  /** Init default metric counters */
  InitMetrics = `${BullContext.Analytic}.init-metrics`,

  /** Collect user info based on its User-Agent request. */
  IdentifyUser = `${BullContext.Analytic}.identify-user`,
}

/**
 * Job names for comment-related operations.
 */
enum CommentJob {
  RatingPoints = `${BullContext.Comment}.process-points`,
  Interaction = `${BullContext.Comment}.process-interactions`,
  ToDelete = `${BullContext.Comment}.process-delete `,
}

/**
 * Job names for Giveaway-related operations.
 */
enum GiveawayJob {
  ToFinish = `${BullContext.Giveaway}.to-finish`,
  CheckToFinish = `${BullContext.Giveaway}.check-to-finish`,
}

/**
 * Job names for publication-related operations.
 */
enum PublicationJob {
  ToRemove = `${BullContext.Publication}.remove`,
  ToForceRemove = `${BullContext.Publication}.force-remove`,
  Interaction = `${BullContext.Publication}.interaction`,
  PollVote = `${BullContext.Publication}.poll-vote`,
  DelayedPublish = `${BullContext.Publication}.publish-delayed`,
}

/**
 * Job names for reaction-related operations.
 */
enum ReactionJob {
  DistributeTips = `${BullContext.Reaction}.distribute-tips`,
}

enum SlackJob {
  Send = `${BullContext.Slack}.send-slack-message`
}

enum RatingSystemJob {
  EventTrigger = `${BullContext.RatingSystem}.trigger`,
  UpdateUserRating = `${BullContext.RatingSystem}.update-user-rating`,
  UpdateCommentRating = `${BullContext.RatingSystem}.update-comment-rating`,
  UpdatePublicationRating = `${BullContext.RatingSystem}.update-publication-rating`,
  DecreasePublicationRating = `${BullContext.RatingSystem}.decrease-publication-rating`,
  UpdateRatingCriterias = `${BullContext.RatingSystem}.update-rating-criterias`,
  RemoveParticipantRewardAction = `${BullContext.RatingSystem}.remove-participant-reward-action`,
}

enum RewardPoolJob {
  DetermineEarnerRewardShare = `${BullContext.RewardPool}.process-earner-reward-share`,
  RemoveEarnerRewardShare = `${BullContext.RewardPool}.remove-earner-reward-share`,
  DetermineEarners = `${BullContext.RewardPool}.determine-earners`,
  DistributeRewardPool = `${BullContext.RewardPool}.distribute-reward-pool`,
}

enum NotificationJob {
  Send = `${BullContext.Slack}.send`,
}

enum WebsocketJob {
  PaymentUpdated = `${BullContext.Websocket}.updated`,
}

enum UserJob {
  UpdateTotalBalance = `${BullContext.User}.update-total-balance`,
  UpdateTotalEarned = `${BullContext.User}.update-total-earned`,
  Reward = `${BullContext.User}.sociogram-reward`,
  Ban = `${BullContext.User}.sociogram-ban`,
  Unban = `${BullContext.User}.sociogram-unban`,
  Delete = `${BullContext.User}.delete-all-data`,
}

enum UserServicesJob {
  UpdateBlockchainData = `${BullContext.UserServices}.update-blockchain-data`,
  UpdateWalletBalances = `${BullContext.UserServices}.update-wallet-balances`,
  UpdateTwitterData = `${BullContext.UserServices}.update-twitter-data`,
}

enum TwitterJob {
  CheckTweetByTag = `${BullContext.Twitter}.check-tweet-by-tag`,
  CheckTweetById = `${BullContext.Twitter}.check-tweet-by-id`,
}

interface JobNameMap {
  [BullContext.Analytic]: typeof AnalyticJob,
  [BullContext.Comment]: typeof CommentJob,
  [BullContext.Giveaway]: typeof GiveawayJob,
  [BullContext.Publication]: typeof PublicationJob,
  [BullContext.Reaction]: typeof ReactionJob,
  [BullContext.Slack]: typeof SlackJob,
  [BullContext.RatingSystem]: typeof RatingSystemJob,
  [BullContext.RewardPool]: typeof RewardPoolJob,
  [BullContext.Notification]: typeof NotificationJob,
  [BullContext.User]: typeof UserJob,
  [BullContext.UserServices]: typeof UserServicesJob,
  [BullContext.Websocket]: typeof WebsocketJob,
  [BullContext.Twitter]: typeof TwitterJob,
}

const jobMap: JobNameMap = {
  [BullContext.Analytic]: AnalyticJob,
  [BullContext.Comment]: CommentJob,
  [BullContext.Giveaway]: GiveawayJob,
  [BullContext.Publication]: PublicationJob,
  [BullContext.Reaction]: ReactionJob,
  [BullContext.RewardPool]: RewardPoolJob,
  [BullContext.Slack]: SlackJob,
  [BullContext.RatingSystem]: RatingSystemJob,
  [BullContext.Notification]: NotificationJob,
  [BullContext.User]: UserJob,
  [BullContext.UserServices]: UserServicesJob,
  [BullContext.Websocket]: WebsocketJob,
  [BullContext.Twitter]: TwitterJob,
}

/**
 * Bull queue context manager.
 * Provides type-safe access to queue names and job types for specific contexts.
 *
 * @template T - The Bull context type, must be a key of JobMap
 *
 * @example
 * ```typescript
 * const analyticCtx = createBullContext(BullContext.Analytic)
 * const queueName = analyticCtx.queue // "analytic_queue"
 * const jobName = analyticCtx.job.UserAction // "analytic.user-action"
 * ```
 */
class BullContextManger<T extends keyof JobNameMap> {
  constructor(readonly context: T) {
  }

  /**
   * Gets the queue name for this context.
   * Queue names follow the pattern: `{context}_queue`
   *
   * @returns The formatted queue name
   *
   * @example
   * ```typescript
   * const ctx = createBullContext(BullContext.Analytic)
   * console.log(ctx.queue) // "analytic_queue"
   * ```
   */
  get queueName(): string {
    return `${this.context}_queue`
  }

  /**
   * Job enum for this context.
   * Provides type-safe access to all available job types for the current context.
   *
   * @returns The job enum corresponding to this context
   *
   * @example
   * ```typescript
   * const ctx = createBullContext(BullContext.Comment)
   * const jobName = ctx.job.RatingPoints // comment.rating-points
   * ```
   */
  get jobName(): JobNameMap[T] {
    return jobMap[this.context]
  }
}

export const createBullContext = <T extends keyof JobNameMap>(context: T): BullContextManger<T> => new BullContextManger(context)
