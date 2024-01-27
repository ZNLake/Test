# Use a base image that includes Node.js and Python
FROM python:3.11 AS builder

LABEL authors="tylersteptoe"

WORKDIR /app

COPY package*.json ./
COPY src/requirements.txt ./requirements.txt

# Install Node.js dependencies
RUN apt-get update && apt-get install -y nodejs npm
RUN npm install

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Copy the application files
COPY src .

# Set environment variables if needed
ENV SPOTIPY_CLIENT_ID=fa413c9476dc4216ba24e2150c1ff7f9
ENV SPOTIPY_CLIENT_SECRET=330f8cca7ec24978a41414215c4aba6a

EXPOSE 5173
# Command to run the application
CMD ["npm", "run", "dev"]
