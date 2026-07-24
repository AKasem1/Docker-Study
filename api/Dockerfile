# initial layer
FROM node:17-alpine

# install nodemon globally
RUN npm install -g nodemon

# set the work directory for the image
WORKDIR /app

# copy package.json and package-lock.json first
# so that we can leverage Docker cache
COPY package*.json .

# all dependencies we need to install in the image:
RUN npm install

# copy project files (we start here)
# additional layers:
COPY . .

# inform docker which port the app is listening on (optional layer)
# we only need this when we are using docker desktop application
# because docker desktop uses this information setup port mapping
# but if we are using docker CLI, we don't need this instruction
EXPOSE 4000

# run the application when container starts
CMD ["npm", "run", "dev"]