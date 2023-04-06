ARG NODE_ALPINE_VERSION=3.16

FROM node:alpine${NODE_ALPINE_VERSION} AS node
MAINTAINER Mahmoud Nassar <mahmoud@nassarx.com>

# Add docker-entrypoint
ADD ./bin/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

# Set the Env
ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}

# Set WORKDIR
ARG APP_ROOT_DIR
WORKDIR $APP_ROOT_DIR

# Set docker entry point
ENTRYPOINT ["docker-entrypoint"]

# Set default command to start the server
CMD ["yarn", "run", "dev"]



