FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies based on package-lock.json
COPY package.json package-lock.json* ./

RUN npm ci

# Copy all source files
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# Expose Next.js default port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Startup command: start Next.js
CMD ["npm", "run", "start"]
