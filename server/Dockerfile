FROM alpine:latest
RUN apk update && apk upgrade
RUN apk add nodejs npm cronie bash
WORKDIR /scripts
COPY ./scripts/cron.sh /etc/cron.d/cron_task
COPY ./scripts .
RUN chmod 0755 /scripts/refresh.sh && chmod 0755 /scripts/entrypoint.sh && chmod 0644 /etc/cron.d/cron_task
RUN mkdir /var/logs && touch /var/logs/cron.log
CMD crond && tail -f /var/logs/cron.log
ENTRYPOINT ["/bin/bash", "/scripts/entrypoint.sh"]
