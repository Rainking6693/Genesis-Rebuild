# A2A Service Setup

## Overview

The A2A service exposes the Genesis orchestrator agent via Agent-to-Agent (A2A) protocol endpoints.

## Endpoints

### GET /a2a/card
Returns the agent metadata card describing capabilities, tools, and configuration.

**Response:**
```json
{
  "name": "Genesis",
  "version": "1.0.0",
  "description": "Primary orchestrator agent for Genesis system. One tool registered (echo).",
  "tools": [...]
}
```

### POST /a2a/invoke
Sends a message to the agent and returns its response.

**Request:**
```json
{
  "message": "Your message here"
}
```

**Response:**
```json
{
  "reply": "Agent's response"
}
```

## Running the Service

### 1. Activate virtual environment
```bash
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements_app.txt
```

### 3. Start the service
```bash
uvicorn a2a_service:app --reload
```

The service will start on `http://127.0.0.1:8000`

### 4. Test the endpoints

In another terminal:
```bash
python test_a2a_service.py
```

Or manually test with curl:
```bash
# Get agent card
curl http://127.0.0.1:8000/a2a/card

# Invoke agent
curl -X POST http://127.0.0.1:8000/a2a/invoke \
  -H "Content-Type: application/json" \
  -d '{"message": "Please echo Hello World"}'
```

## Architecture

- **a2a_service.py**: FastAPI application exposing A2A endpoints
- **a2a_card.json**: Agent metadata (name, version, tools, endpoints)
- **genesis_orchestrator.py**: Core agent implementation
- **tool_echo.py**: Example tool implementation
- **test_a2a_service.py**: Automated endpoint tests

## Next Steps

1. Deploy to VPS with public endpoint
2. Register agent with A2A discovery service
3. Implement OAuth 2.1 authentication
4. Add more business logic tools
5. Implement task lifecycle management (pending/running/completed)
