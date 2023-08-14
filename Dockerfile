# Fetching the minified node image on apline linux
FROM node:slim

# Declaring env
ENV NODE_ENV production

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN npm install

# Starting our application
CMD [ "node", "app.js" ]

# Exposing server port
EXPOSE 5000