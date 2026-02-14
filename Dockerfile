FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY pyproject.toml .
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY content/ ./content/

# Install Python dependencies
RUN pip install --no-cache-dir -e .

# Expose port (Railway will set PORT env var)
EXPOSE 8003

# Run with uvicorn - use PORT env var if set, otherwise default to 8003
CMD ["sh", "-c", "uvicorn src.api.main:app --host 0.0.0.0 --port ${PORT:-8003}"]
