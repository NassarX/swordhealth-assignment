import amqp from 'amqplib';

// Connection configs
export interface ConnectionConfig {
  url: string,
}

// Exchange configs
export interface ExchangeConfig {
  name: string,
  type?: string,
  options?: amqp.Options.AssertExchange,
}

// Queue configs
export interface QueueConfig {
  name: string,
  options?: amqp.Options.AssertQueue,
  bindings?: BindingConfig[],
}

// Bindings configs
interface BindingConfig {
  exchange: string,
  routingKey: string,
}

const buildAmqpUrl = (options: amqp.Options.Connect): string => {
	const protocol = options.protocol || 'amqp';
	const hostname = options.hostname || 'localhost';
	const port = options.port || 5672;
	const username = encodeURIComponent(options.username || 'guest');
	const password = encodeURIComponent(options.password || 'guest');
	const vhost = encodeURIComponent(options.vhost || '/');

	return `${protocol}://${username}:${password}@${hostname}:${port}/${vhost}`;
};

export const getRabbitMQConnectionConfig = (): ConnectionConfig => {
	return {
		url: buildAmqpUrl({
			protocol: process.env.AMQP_PROTOCOL as string,
			hostname: process.env.AMQP_HOSTNAME as string,
			port: parseInt(process.env.AMQP_AMQP_PORT || '5672', 10) as number,
			username: process.env.AMQP_USERNAME as string,
			password: process.env.AMQP_PASSWORD as string,
			vhost: process.env.AMQP_VHOST as string
		})
	};
};

export const EXCHANGES_METADATA: { [key: string]: ExchangeConfig } = {
	maintenance_tasks: {
		name: process.env.AMQP_MAINTENANCE_TASKS_EXCHANGE || 'maintenance_tasks' as string,
		type: process.env.AMQP_MAINTENANCE_TASKS_EXCHANGE_TYPE || 'direct' as string,
		options: {
			durable: true // So it survives any server restart or failure (written to disk temp)
		}
	},
	default_exchange: {
		name: 'default_tasks_exchange' as string, // @TODO move it
		type: 'direct' as string,
		options: {
			durable: true // So it survives any server restart or failure (written to disk temp)
		}
	}
};

export const QUEUES_METADATA: { [key: string]: QueueConfig } = {
	manager_tasks: {
		name: process.env.AMQP_MAINTENANCE_TASKS_MANAGER_QUEUE || 'manager_tasks' as string,
		options: { durable: true },
		bindings: [
			{
				exchange: process.env.AMQP_MAINTENANCE_TASKS_EXCHANGE || 'maintenance_tasks',
				routingKey: process.env.AMQP_MAINTENANCE_TASKS_PERFORMED_BINDING_KEY || 'task.performed'
			}]
	},
	default_queue: {
		name: 'default_tasks_queue' as string,
		options: { durable: true },
		bindings: [
			{
				exchange: 'default_tasks_exchange',
				routingKey: 'task.*'
			}]
	}

};

