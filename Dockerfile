
FROM registry.cn-hangzhou.aliyuncs.com/skylark/saler-nginx:1.18.0-alpine
WORKDIR /usr/share/nginx/html/
COPY ./dist/ ./tiny_wish
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD nginx -g "daemon off;"