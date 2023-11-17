FROM 894185188610.dkr.ecr.ap-south-1.amazonaws.com/centrum:18.12.0
WORKDIR /app
COPY . .
RUN mkdir -p src/log
RUN npm install
RUN npm install pm2@latest -g
#RUN pm2 start src/index.js
EXPOSE 8001
CMD ["pm2-runtime","/app/index.js"]
