import amqp, { Channel } from 'amqplib';
import {
	ConnectionConfig,
	ExchangeConfig,
	QueueConfig
} from '../config/amqp.config';
import Logger from './Logger';
import { Service } from "typedi";

@Service()
class AmqpClient {
	public connection!: amqp.Connection;

	public channel!: amqp.Channel;

	constructor(private config: ConnectionConfig) {}

	async connect(): Promise<AmqpClient> {
		try {
			this.connection = await amqp.connect(this.config.url);
			Logger.info("RabbitMQ Server initialized successfully");
			console.log('Connected to RabbitMQ successfully');
		} catch (err) {
			Logger.error("Could not initialize RabbitMQ Server");
			console.error('Error connecting to RabbitMQ:', err);
			throw err;
		}

		return this;
	}

	async createChannel(): Promise<void> {
		this.channel = await this.connection.createChannel();
	}

	public async assertExchanges(exchangeConfig: ExchangeConfig): Promise<Channel> {
		await this.channel.assertExchange(
			exchangeConfig.name,
			exchangeConfig.type || 'direct',
			exchangeConfig.options || {}
		);
		Logger.info(`Exchange '${exchangeConfig.name}' is ready`);

		return this.channel;
	}

	public async bindExchangeQueues(queueConfig: QueueConfig): Promise<Channel> {
	    const assertQueueResult = await this.channel.assertQueue(queueConfig.name, queueConfig.options);
		if (queueConfig.bindings) {
			for (const bindingConfig of queueConfig.bindings) {
				await this.channel.bindQueue(assertQueueResult.queue, bindingConfig.exchange, bindingConfig.routingKey);
				Logger.info(`Binding '${bindingConfig.exchange}' with routing key '${bindingConfig.routingKey}' is ready`);
				console.log(`Binding '${bindingConfig.exchange}' with routing key '${bindingConfig.routingKey}' is ready`);
			}
		}
		return this.channel;
	}

	async close() {
		// @TODO trade-off between open/close connection & channels!
		await this.channel.close();
	}
}

export default AmqpClient;
