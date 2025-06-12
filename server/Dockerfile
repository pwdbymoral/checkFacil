# Dockerfile
FROM node:22
WORKDIR /app
COPY . .
RUN yarn install
EXPOSE 3001

CMD ["yarn", "start"]  # Altere se o script for outro (ex: yarn dev)
