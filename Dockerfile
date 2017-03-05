#FROM node:alpine
FROM tbaltrushaitis/ubuntu-nodejs

ADD . /hatu
WORKDIR /hatu

RUN npm install 
RUN npm run build

EXPOSE 2222
CMD ["npm", "run", "start:prod"]