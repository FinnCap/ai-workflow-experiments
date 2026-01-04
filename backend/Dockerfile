FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

RUN pip install uv

COPY pyproject.toml uv.lock ./
COPY . .

RUN uv sync

EXPOSE 7777

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7777"]
