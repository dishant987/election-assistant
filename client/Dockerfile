# Build stage
FROM node:20-slim as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# VITE_API_URL must be provided as a build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Serve stage
FROM nginx:alpine

# Copy custom nginx template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy build artifacts to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run uses the PORT environment variable
ENV PORT=8080

CMD ["sh", "-c", "envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
