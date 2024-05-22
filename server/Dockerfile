FROM alpine:latest
RUN apk update && apk upgrade
RUN apk add nodejs npm cronie bash
WORKDIR /app
COPY ./scripts/cron.sh /etc/cron.d/cron_task
COPY . .
RUN chmod 0755 /app/scripts/refresh.sh && chmod 0755 /app/scripts/entrypoint.sh && chmod 0644 /etc/cron.d/cron_task
RUN mkdir /var/logs && touch /var/logs/cron.log
RUN npm i
CMD crond && tail -f /var/logs/cron.log
ENTRYPOINT ["/bin/bash", "/app/scripts/entrypoint.sh"]
