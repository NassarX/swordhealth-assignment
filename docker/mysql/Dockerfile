ARG MYSQL_VERSION=8.0

FROM mysql:${MYSQL_VERSION} AS mysql
MAINTAINER Mahmoud Nassar <mahmoud@nassarx.com>

#ADD my.cnf /etc/mysql/conf.d/my.cnf

# Add docker-entrypoint
COPY ./bin/docker-entrypoint.sh /usr/local/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN chown -R mysql:root /var/lib/mysql/

ARG MYSQL_DATABASE=swordhealth_maintenance
ARG MYSQL_USER=sword_health
ARG MYSQL_PASSWORD=root
ARG MYSQL_ROOT_PASSWORD=root

ENV MYSQL_DATABASE=$MYSQL_DATABASE \
    MYSQL_USER=$MYSQL_USER \
    MYSQL_PASSWORD=$MYSQL_PASSWORD \
    MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD

# Set docker entry point
ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3306 33060
CMD ["mysqld"]
