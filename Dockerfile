FROM node:8.14.0-jessie
COPY . /root
WORKDIR /root
RUN npm i -g typescript
RUN npm install
RUN tsc
CMD ["npm", "start"]
