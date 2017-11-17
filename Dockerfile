FROM node:alpine
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json .
RUN npm install
# Bundle app source
COPY . .

# Bind app port
EXPOSE 3000

# Define command to run the app
CMD [ "node", "app" ]
