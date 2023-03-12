ARG NODE_ALPINE_VERSION=3.16

FROM node:alpine${NODE_ALPINE_VERSION} AS assignment_node
MAINTAINER Mahmoud Nassar <mahmoud@nassarx.com>

# Add docker-entrypoint
ADD ./bin/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

# Set the Env
ARG APPLICATION_API_SERVER_ENV=production
ENV APPLICATION_API_SERVER_ENV=${APPLICATION_API_SERVER_ENV}

# Set WORKDIR
ARG APPLICATION_ROOT_DIR
WORKDIR $APPLICATION_ROOT_DIR

# Set docker entry point
ENTRYPOINT ["docker-entrypoint"]

# Set default command to start the server
CMD ["yarn", "run", "dev"]



