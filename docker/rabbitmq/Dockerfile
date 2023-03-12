ARG RABBITMQ_VERSION=3.11

FROM rabbitmq:${RABBITMQ_VERSION}-management AS assignment_rabbitmq
MAINTAINER Mahmoud Nassar <mahmoud@nassarx.com>

# Enable RabbitMQ plugins
RUN rabbitmq-plugins enable --offline rabbitmq_management

# Start rmq server
CMD ["rabbitmq-server"]

# Expose ports for management and AMQP
EXPOSE 15671 15672 5672 5671

