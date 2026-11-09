FROM python:3.11-slim

WORKDIR /app

# Install CPU-only PyTorch first
RUN pip install --no-cache-dir torch==2.5.1 
    --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy application, models and required datasets
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 