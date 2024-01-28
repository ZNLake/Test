# Stage 1: Build Node.js Vite app
FROM node:20 as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Copy dist folder to Python image
FROM python:3.10.8-slim-buster

WORKDIR /app

COPY ./server .
COPY --from=build-stage /app/dist ./frontend

RUN pip install -r requirements.txt

ENTRYPOINT ["python"]
CMD ["app.py"]

EXPOSE 5000