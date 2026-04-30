FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Ensure dist exists
RUN ls -la dist/

EXPOSE 3000

CMD ["npm", "start"]
