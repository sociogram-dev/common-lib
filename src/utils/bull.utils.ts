/**
 * Enum representing all available Bull queues used in the application.
 *
 * Each value corresponds to the name of a BullMQ or Bull queue where background jobs are dispatched and processed.
 *
 * These queues separate domain-specific background processing logic (e.g., sending notifications, handling tweets, syncing users, etc.).
 *
 * @example
 * queue.add(BullQueue.Notification, { userId, message });
 */
export enum BullQueue {
  Giveaway = 'giveaway_queue',
  TweetByTag = 'tweet_by_tag_queue',
  TweetById = 'tweet_by_id_queue',
  Notification = 'notification_queue',
  Publication = 'publication_queue',
  RewardPool = 'reward_pool_queue',
  Comment = 'comment_queue',
  Transaction = 'transaction_queue',
  User = 'user_queue',
  UserServices = 'user_services_queue',
  Reaction = 'reaction_queue',
  Slack = 'slack_queue',
  Rating = 'rating_queue',
  Trades = 'trades_queue',
  Websocket = 'websocket_queue',
}

