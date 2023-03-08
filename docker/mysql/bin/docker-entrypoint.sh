#!/bin/bash

set -eo pipefail

# check if MySQL is available
until mysqladmin ping -u ${MYSQL_USER} -p${MYSQL_PASSWORD} >/dev/null 2>&1; do
  echo "Waiting for MySQL to be available - sleeping"
  sleep 1
done

# Create the database if it doesn't exist
if ! mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} -e "use ${MYSQL_DATABASE}" >/dev/null 2>&1; then
  echo "Creating database ${MYSQL_DATABASE}"
  mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} -e "create database ${MYSQL_DATABASE}"
fi

# execute any schema files in /docker-entrypoint-initdb.d
if [[ -d /docker-entrypoint-initdb.d ]] && [[ $(ls -A /docker-entrypoint-initdb.d/*.sql 2>/dev/null) ]]; then
  for f in /docker-entrypoint-initdb.d/*.sql; do
    echo "Executing schema file $f"
    mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} < "$f"
  done
fi

# start MySQL
exec "$@"
