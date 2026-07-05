# -------- Stage 1: Build --------
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# -------- Stage 2: Production runtime --------
FROM node:18-alpine
WORKDIR /app

# Create non-root user for security (DevSecOps best practice)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app /app

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3000/health || exit 1

CMD ["node", "app.js"]
