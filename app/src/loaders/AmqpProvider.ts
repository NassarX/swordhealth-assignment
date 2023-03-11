import AmqpClient from '../lib/AmqpClient';
import { ConnectionConfig, getRabbitMQConnectionConfig } from "../config/amqp.config";

export class AmqpProvider {
  private static connectionConfig: ConnectionConfig;

	/**
   * Initialize AMQP connection
   */
  public static async init() {
		try {
      this.connectionConfig = getRabbitMQConnectionConfig();

			const connection = new AmqpClient(this.connectionConfig);
			await connection.connect().then(() => {
				console.log('AMQP connection established successfully!');
			});
		} catch (error) {
			console.error('Unable to initialize the databases:', error);
		}
	}
}
