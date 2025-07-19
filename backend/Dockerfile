FROM python:3.10-slim

# System dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry manually (recommended way)
ENV POETRY_VERSION=1.8.2
RUN curl -sSL https://install.python-poetry.org | python3 -

# Add poetry to path
ENV PATH="/root/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy only dependency files first for caching
COPY pyproject.toml poetry.lock* ./

# Install Python dependencies without virtualenv
RUN poetry config virtualenvs.create false && \
    poetry install --no-dev --no-interaction --no-ansi

# Now copy the full app
COPY . .

# Expose app port
EXPOSE 8000

# Start the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
