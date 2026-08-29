# ==========================================
# Stage 1: Build Vite / React Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Install Node dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build production assets
COPY client/ ./client/
COPY shared/ ./shared/
COPY vite.config.ts tsconfig.json postcss.config.js tailwind.config.ts components.json ./
RUN npm run build

# ==========================================
# Stage 2: Python LangGraph Backend Runtime
# ==========================================
FROM python:3.11-slim AS runtime
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application source code
COPY backend/ ./backend/

# Copy built frontend assets from Stage 1 into dist/public
COPY --from=frontend-builder /app/dist/public ./dist/public

# Set environment defaults
ENV PORT=5000
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/api/health || exit 1

# Start FastAPI application via Uvicorn
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}"]
