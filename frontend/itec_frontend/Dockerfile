FROM node:latest

# Create app directory
RUN mkdir -p /frontend
WORKDIR /frontend

# Install app dependencies
COPY package.json /frontend
RUN npm install
RUN npm install -g serve
COPY . /frontend
RUN npm run build
# Bundle app source


EXPOSE 3000

CMD serve -s build

