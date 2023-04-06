import AmqpClient from "../../../lib/AmqpClient";
import { EXCHANGES_METADATA, QUEUES_METADATA } from "../../../config/amqp.config";
import appConfig from "../../../config/app.config";
export class MessageConsumer {
  private readonly amqpClient: AmqpClient;

  public constructor(amqpClient: AmqpClient) {
    this.amqpClient = amqpClient;
  }

  public async subscribe(): Promise<void> {
    try {
      await this.amqpClient.createChannel();

      /**
       * @TODO update to include dynamic configs for all desired exchanges & queues.
       */
      const tasksExchange = EXCHANGES_METADATA[appConfig.config().tasksExchange];
      const tasksQueue = QUEUES_METADATA[appConfig.config().tasksQueue];

      // assert tasks exchange
      await this.amqpClient.assertExchanges(tasksExchange);

      // bind tasks queues
      const channel = await this.amqpClient.bindExchangeQueues(tasksQueue);

       // consumer queue messages
      await channel.consume(tasksQueue.name, async (messageData) => {

        if (messageData === null) {
          return;
        }

        try {
          // Decode message contents
          const message = JSON.parse(messageData.content.toString());
          // handle message
          await this.handleMessage(message);
          await channel.ack(messageData);
        } catch (error) {
          await channel.nack(messageData);
        }
      });
    } catch (error) {
      console.error("error", error)
      //throw new MessageError(error.message);
    }
  }

  public handleMessage(message: any): Promise<any> {
    console.log("Message received from Queue: ", message);
    return Promise.resolve()
  }
}
