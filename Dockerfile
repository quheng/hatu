#FROM node:alpine
FROM tbaltrushaitis/ubuntu-nodejs

ADD . /hatu
WORKDIR /hatu

# If you have native dependencies, you'll need extra tools

# If you need npm, don't use a base tag
RUN npm install
RUN npm run build


EXPOSE 2222
CMD ["npm", "run", "start:prod"]