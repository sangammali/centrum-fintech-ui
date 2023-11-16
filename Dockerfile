FROM node:18.12.0-alpine
WORKDIR /app
COPY . .
RUN mkdir -p src/log
RUN npm install
RUN npm install pm2@latest -g
#RUN pm2 start src/index.js
EXPOSE 8001
CMD ["pm2-runtime","/app/index.js"]
