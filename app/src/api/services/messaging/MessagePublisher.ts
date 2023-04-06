import AmqpClient from "../../../lib/AmqpClient";
import { Channel } from "amqplib";
import { EXCHANGES_METADATA, QUEUES_METADATA } from "../../../config/amqp.config";
export abstract class MessagePublisher {
  static amqpClient: AmqpClient;

  private readonly exchange: string;
  private readonly queue: string;

  protected constructor(exchange: string, queue: string) {
    this.exchange = this.validateExchangeConfig(exchange);
    this.queue = this.validateQueueConfig(queue);
  }

  protected async publish(content: any): Promise<any>  {
    try {
      await MessagePublisher.amqpClient.createChannel();
      await MessagePublisher.amqpClient.assertExchanges(EXCHANGES_METADATA[this.exchange]);
      await MessagePublisher.amqpClient.bindExchangeQueues(QUEUES_METADATA[this.queue])
        .then((channel: Channel) => {
          channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(content)));
        });
      console.log(`Message send successfully`);
      await MessagePublisher.amqpClient.close();
    } catch (error) {
      console.log(`Message failed to send: ${error}`);
    }
  }

  public abstract validateExchangeConfig(exchange: string): string;

  public abstract validateQueueConfig(exchange: string): string;
}
