FROM node:22.13.1-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./

COPY prisma ./prisma/

RUN pnpm install

COPY . .

RUN npx prisma generate

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "npx prisma migrate deploy && pnpm build && pnpm start"]