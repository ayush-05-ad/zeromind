FROM python:3.11.9-slim-bookworm

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc build-essential && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Step 4:** Requirements me bhi pydantic version fix kar. VS Code me `requirements.txt` me ye 2 lines replace kar:

Purana:
```
pydantic[email]==2.10.6
pydantic-settings==2.7.1
```

Naya:
```
pydantic[email]==2.9.2
pydantic-core==2.23.4
pydantic-settings==2.5.2