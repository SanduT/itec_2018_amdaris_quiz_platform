FROM node:latest

# Create app directory
RUN mkdir -p /backend
WORKDIR /backend

# Install app dependencies
COPY package.json /backend
RUN npm install
RUN npm install -g pm2
# Bundle app source
COPY . /backend

EXPOSE 8080

CMD ENV=docker MONGO_DB_URI=mongodb://mongo:27017/quizzard pm2 start index.js && pm2 logs

