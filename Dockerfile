FROM node:20-alpine AS base

# Install dependencies required for Prisma & libc on Alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Install dependencies based on package-lock.json
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci

# Copy all source files
COPY . .

# Generate Prisma Client and build Next.js application
RUN npx prisma generate
RUN npm run build

# Expose Next.js default port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Startup command: run database migration then start Next.js
CMD ["sh", "-c", "npx prisma db push && npm run start"]
