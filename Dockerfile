FROM nginxinc/nginx-unprivileged

COPY ./build/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8081