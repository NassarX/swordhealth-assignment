import AmqpClient from '../lib/AmqpClient';
import { ConnectionConfig, getRabbitMQConnectionConfig } from "../config/amqp.config";
import {MessagePublisher} from "../api/services/messaging/MessagePublisher";
import Logger from "../utils/Logger";
import {MessageConsumer} from "../api/services/messaging/MessageConsumer";

export class AmqpProvider {
	/**
   * Initialize AMQP connection
   */
  public static async init() {
		try {
      const connectionConfig: ConnectionConfig = getRabbitMQConnectionConfig();

			const amqp = new AmqpClient(connectionConfig);
			await amqp.connect().then((amqpClient: AmqpClient) => {
        MessagePublisher.amqpClient = amqpClient;
        console.log('AMQP connection established successfully!');

        new MessageConsumer(amqpClient).subscribe();


      }).catch((err: any) => {
        Logger.error(`Unable to initialize the AMQP Connection: ${err}`);
        console.error('Unable to initialize the AMQP Connection:', err);
      });
		} catch (err) {
      Logger.error(`Something went wrong on establishing AMQP Client: ${err}`);
      console.error('Something went wrong on establishing AMQP Client:', err);
		}
	}
}
