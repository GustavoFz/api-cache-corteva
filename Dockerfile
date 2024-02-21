# Base image
FROM node:21

# Create app directory
WORKDIR /app

# Install ODBC Driver Managers
RUN apt-get update && apt-get install -y odbcinst1debian2 libodbc1 odbcinst unixodbc unixodbc-dev

# Bundle app source
COPY . .

#
RUN mkdir odbc-cache | tar -xzf ODBC-2018.1.8.766.0-lnxubuntux64.tar.gz -C odbc-cache
RUN odbcinst -i -d -f odbcinst.ini
RUN odbcinst -i -s -h -f odbc.ini
RUN odbcinst -i -s -l -f odbc.ini

COPY .env .

# Install app dependencies
RUN npm install

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start:prod"]



