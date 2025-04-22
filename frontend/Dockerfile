# Build stage
FROM node:18 as build

WORKDIR /app

# Add this line before build
ENV NODE_OPTIONS=--openssl-legacy-provider

COPY . .
RUN npm install
RUN npm install pusher-js
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80