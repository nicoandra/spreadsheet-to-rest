# Docker Parent Image with Node and Typescript
FROM reidweb1/node-typescript:1.0.0

# Create Directory for the Container
WORKDIR /code

# Copy the files we need to our new Directory
ADD . /code

# Expose the port outside of the container
EXPOSE 3000

# Grab dependencies and transpile src directory to dist
RUN npm install && tsc

# Start the server
ENTRYPOINT ["nodemon"]
