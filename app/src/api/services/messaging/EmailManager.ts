import {MessagePublisher} from "./MessagePublisher";
import {EXCHANGES_METADATA, QUEUES_METADATA} from "../../../config/amqp.config";

export class EmailManager extends MessagePublisher {
  constructor(exchange: string, queue: string) {
    super(exchange, queue)
  }

  async sendEmail(emailDto: any): Promise<any>  {
    /**
     * @TODO Implement and configure Email service !
     * @TODO set email message and publish it to the queue.
     */
    await super.publish(emailDto);
  }

  public handleMessage(message: any): Promise<any> {
    console.log(message);
    return message; //@TODO ot be implemented better way based on each channel
  }

  validateExchangeConfig(exchangeName: string): string {
    const exchangeConfig = EXCHANGES_METADATA[exchangeName];

    // return QueueConfig ? queueName : (() => { throw new Error(`Invalid exchange config for ${exchangeName}`) })();
    return exchangeConfig ? exchangeName : 'default_exchange';
  }

  validateQueueConfig(queueName: string): string {
    const QueueConfig = QUEUES_METADATA[queueName];

    // return QueueConfig ? queueName : (() => { throw new Error(`Invalid queue config for ${queueName}`) })();
    return QueueConfig ? queueName : 'default_queue';
  }
}
