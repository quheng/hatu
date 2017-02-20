#FROM node:alpine
FROM tbaltrushaitis/ubuntu-nodejs
# FROM mhart/alpine-node:base
# FROM mhart/alpine-node:base-0.10

ADD . /hatu
WORKDIR /hatu

# If you have native dependencies, you'll need extra tools

# If you need npm, don't use a base tag
RUN npm install
RUN npm run build

# If you had native dependencies you can now remove build tools
#RUN apk del python && \
#  rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

EXPOSE 2222
CMD ["npm", "start"]