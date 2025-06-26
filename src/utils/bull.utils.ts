/**
 * Bull queue contexts for different application domains.
 * Each context represents a separate queue for processing specific types of jobs.
 */
export enum BullContext {
  Analytic = 'analytic',
  Giveaway = 'giveaway',
  Tweeter = 'tweeter',
  Notification = 'notification',
  Publication = 'publication',
  RewardPool = 'reward_pool',
  Comment = 'comment',
  Transaction = 'transaction',
  User = 'user',
  Reaction = 'reaction',
  Slack = 'slack',
  Rating = 'rating',
  Trades = 'trades',
  Websocket = 'websocket',
}

/**
 * Job names for analytics processing.
 */
enum AnalyticJob {
  /** Handle earnings. */
  Earnings = `${BullContext.Analytic}.earnings`,

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

interface JobMap {
  [BullContext.Analytic]: typeof AnalyticJob,
  [BullContext.Comment]: typeof CommentJob,
  [BullContext.Giveaway]: typeof GiveawayJob,
  [BullContext.Publication]: typeof PublicationJob,
  [BullContext.Reaction]: typeof ReactionJob,
}

const jobMap: JobMap = {
  [BullContext.Analytic]: AnalyticJob,
  [BullContext.Comment]: CommentJob,
  [BullContext.Giveaway]: GiveawayJob,
  [BullContext.Publication]: PublicationJob,
  [BullContext.Reaction]: ReactionJob,
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
class BullContextManger<T extends keyof JobMap> {
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
  get queue(): string {
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
  get job(): JobMap[T] {
    return jobMap[this.context]
  }
}

export const createBullContext = <T extends keyof JobMap>(context: T): BullContextManger<T> => new BullContextManger(context)
