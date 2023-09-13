FROM nginx

RUN rm /etc/nginx/nginx.conf
# removing default nginx configuration file

COPY nginx.conf /etc/nginx
# Adding Custom nginx configuration file to the nginx path so that we can use it as reverse proxy to access all 3 microservice


