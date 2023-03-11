import amqp from 'amqplib';
import { ConnectionConfig, ExchangeConfig, QueueConfig } from '../config/amqp.config';
import { Channel } from "amqplib";
import Logger from '../utils/Logger';

class AmqpClient {
	private connection!: amqp.Connection;
	private channels: Record<string, amqp.Channel> = {};

	constructor(private config: ConnectionConfig) {}

	async connect(): Promise<void> {
		try {
			this.connection = await amqp.connect(this.config.url);
			Logger.info("RabbitMQ Server initialized successfully");
			console.log('Connected to RabbitMQ successfully');
			await this.createChannels();
		} catch (err) {
			Logger.error("Could not initialize RabbitMQ Server");
			console.error('Error connecting to RabbitMQ:', err);
			throw err;
		}
	}

	async createChannels(): Promise<void> {
		await Promise.all(this.config.channels.map(async channelConfig => {
			const channelName = channelConfig.name || 'default';
			const channel = await this.connection.createChannel();
			// this.channels[channelName] = channel;
			await this.createExchanges(channel, channelConfig.exchanges);
			await this.bindQueues(channel, channelConfig.queues);
      Logger.info(`Channel '${channelName}' is ready`);
			console.log(`Channel '${channelName}' is ready`);
		}));
	}

	async createExchanges(channel: Channel, exchangesConfig: ExchangeConfig[]): Promise<void> {
		for (const exchangeConfig of exchangesConfig) {
			await channel.assertExchange(
				exchangeConfig.name,
				exchangeConfig.type || 'direct',
				exchangeConfig.options || {}
			);
      Logger.info(`Exchange '${exchangeConfig.name}' is ready`);
		}
	}

	async bindQueues(channel: Channel, queuesConfig: QueueConfig[]): Promise<void> {
		for (const queueConfig of queuesConfig) {
			const assertQueueResult = await channel.assertQueue(queueConfig.name, queueConfig.options);
			if (queueConfig.bindings) {
				for (const bindingConfig of queueConfig.bindings) {
					await channel.bindQueue(assertQueueResult.queue, bindingConfig.exchange, bindingConfig.routingKey);
          Logger.info(`Binding '${bindingConfig.exchange}' with routing key '${bindingConfig.routingKey}' is ready`);
          console.log(`Binding '${bindingConfig.exchange}' with routing key '${bindingConfig.routingKey}' is ready`);
				}
			}
		}
	}
}

export default AmqpClient;
