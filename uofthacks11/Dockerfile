# Stage 1: Build Node.js Vite app
FROM node:14 as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Copy dist folder to Python image
FROM python:3.9

WORKDIR /app

COPY ./server .
COPY --from=build-stage /app/dist ./frontend

RUN pip install -r requirements.txt

CMD ["flask", "run"]

EXPOSE 5000