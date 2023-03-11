import amqp from 'amqplib';

// Connection configs
export interface ConnectionConfig {
  url: string,
  channels: ChannelConfig[],
}

// Channel configs
export interface ChannelConfig {
  name: string,
  exchanges: ExchangeConfig[],
  queues: QueueConfig[],
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

	console.log(`${protocol}://${username}:${password}@${hostname}:${port}/${vhost}`);

	return `${protocol}://${username}:${password}@${hostname}:${port}/${vhost}`;
};

export const getRabbitMQConnectionConfig = (): ConnectionConfig =>  {
  return {
    url: buildAmqpUrl({
      protocol: process.env.AMQP_PROTOCOL as string,
      hostname: process.env.AMQP_HOSTNAME as string,
      port: parseInt(process.env.AMQP_AMQP_PORT || '5672', 10) as number,
      username: process.env.AMQP_USERNAME as string,
      password: process.env.AMQP_PASSWORD as string,
      vhost: process.env.AMQP_VHOST as string
	}),
    channels: [
      {
        name: process.env.AMQP_NOTIFICATIONS_CHANNEL || 'notifications' as string,
			  exchanges: [
          {
            name: process.env.AMQP_MAINTENANCE_TASKS_EXCHANGE || 'maintenance_tasks_exchange' as string,
            type: process.env.AMQP_MAINTENANCE_TASKS_EXCHANGE_TYPE || 'direct' as string,
            options: {
              durable: true // So it survives any server restart or failure (written to disk temp)
            }
          }],
        queues: [
          {
            name: process.env.AMQP_MAINTENANCE_TASKS_MANAGER_QUEUE || 'manager_notification_queue' as string,
            options: {
              durable: true
            },
            bindings: [
              {
                exchange: process.env.AMQP_MAINTENANCE_TASKS_EXCHANGE || 'maintenance_tasks_exchange',
                routingKey: process.env.AMQP_MAINTENANCE_TASKS_UPDATED_BINDING_KEY || 'task_updated'
              },
              {
                exchange: process.env.AMQP_MAINTENANCE_TASKS_EXCHANGE || 'maintenance_tasks_exchange',
                routingKey: process.env.AMQP_MAINTENANCE_TASKS_PERFORMED_BINDING_KEY || 'task_performed'
              }]
          }]
      }]
  }
};

