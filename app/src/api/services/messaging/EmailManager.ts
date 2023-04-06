import {MessagePublisher} from "./MessagePublisher";
import {EXCHANGES_METADATA, QUEUES_METADATA} from "../../../config/amqp.config";
import {NotifiableInterface} from "../../types/interfaces/notifiable.interface";
import {NotificationDTo} from "../../types/dtos/notification.dto";
import {UserDto} from "../../types/dtos/user.dto";

export class EmailManager extends MessagePublisher implements NotifiableInterface{
  constructor(exchange: string, queue: string) {
    super(exchange, queue)
  }

  async send(user: UserDto, notification: NotificationDTo): Promise<any>  {
    const playLoad = {
      'user_id': user.id,
      'user_email': user.email,
      'content': notification.content
    };
    /**
     * @TODO Implement and configure Email service !
     * @TODO set email message and publish it to the queue.
     */
    await super.publish(playLoad);
  }

  validateExchangeConfig(exchangeName: string): string {
    const exchangeConfig = EXCHANGES_METADATA[exchangeName];

    return exchangeConfig ? exchangeName : 'default_exchange';
  }

  validateQueueConfig(queueName: string): string {
    const QueueConfig = QUEUES_METADATA[queueName];

    return QueueConfig ? queueName : 'default_queue';
  }
}
