#!/bin/sh
set -e

# Install deps
yarn install

# Build dist
yarn build

# Copy static files
cp -r public dist/public

# Run yarn on development | production mode
if [ "$APPLICATION_API_SERVER_ENV" = "production" ]; then
  echo "Running in production mode"
else
  echo "Running in development mode"
fi

## Start the server
exec "$@"
