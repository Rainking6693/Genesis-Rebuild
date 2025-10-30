# Vertex AI Tuned Models Setup Guide

This guide explains how to use the Genesis tuned Gemini models via Vertex AI.

## Overview

Genesis has 6 tuned Gemini models hosted on Google Cloud Vertex AI:
- **QA Agent**: Technical support and troubleshooting
- **Support Agent**: Customer support and issue resolution
- **Analyst Agent**: Business analytics and reporting
- **Legal Agent**: Legal compliance and contract review
- **Content Agent**: Marketing copy and content creation
- **Security Agent**: Security auditing and best practices

## Prerequisites

1. **Google Cloud Project**: Access to the `genesis-finetuning-prod` project
2. **Service Account**: A service account with Vertex AI User permissions
3. **Credentials**: Service account JSON key file

## Setup Steps

### 1. Create Service Account (if needed)

If you don't have a service account yet:

```bash
# In Google Cloud Console:
1. Go to IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Name: "genesis-vertex-user"
4. Grant role: "Vertex AI User"
5. Click "Create Key" → JSON
6. Save the file securely
```

### 2. Configure Environment

Add to your `.env` file:

```bash
# Vertex AI Configuration
VERTEX_PROJECT_ID=genesis-finetuning-prod
VERTEX_LOCATION=us-central1

# Optional: Path to service account JSON key
# GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account.json

# Tuned model resource names (already in .env)
GENESIS_QA_MODEL="projects/191705308051/locations/us-central1/models/4274614236258238464@1"
GENESIS_SUPPORT_MODEL="projects/191705308051/locations/us-central1/models/3505061649931304960@1"
GENESIS_ANALYST_MODEL="projects/191705308051/locations/us-central1/models/8772021414141100032@1"
GENESIS_LEGAL_MODEL="projects/191705308051/locations/us-central1/models/300750515057197056@1"
GENESIS_CONTENT_MODEL="projects/191705308051/locations/us-central1/models/1651830403268345856@1"
GENESIS_SECURITY_MODEL="projects/191705308051/locations/us-central1/models/1919794581096890368@1"
```

### 3. Authenticate

**Option A: Service Account Key File** (for local development):

```bash
# Set in .env:
GOOGLE_APPLICATION_CREDENTIALS=/home/genesis/keys/genesis-sa.json
```

**Option B: gcloud CLI** (if running on your local machine):

```bash
gcloud auth application-default login
gcloud config set project genesis-finetuning-prod
```

**Option C: GCP Instance** (if running on GCE/Cloud Run):

No additional setup needed. The instance's default service account will be used.

### 4. Verify Setup

```bash
python scripts/check_vertex_setup.py
```

This will check:
- ✅ Environment variables are set
- ✅ Model configurations are present
- ✅ Credentials are available (or warn if missing)

## Usage

### Python API

```python
from infrastructure.vertex_client import ask_agent

# Ask any Genesis agent
answer = ask_agent("qa", "How do I reset my password?")
print(answer)

# Other roles: support, analyst, legal, content, security
```

### FastAPI Endpoint

Start the API server:

```bash
# In your FastAPI app (main.py or app.py):
from fastapi import FastAPI
from api.routes.agents import router as agents_router

app = FastAPI()
app.include_router(agents_router)

# Then run:
uvicorn main:app --reload
```

Call the endpoint:

```bash
curl -X POST http://localhost:8000/agents/ask \
  -H "Content-Type: application/json" \
  -d '{"role": "qa", "prompt": "How do I reset my password?"}'
```

Response:

```json
{
  "role": "qa",
  "answer": "To reset your password: 1. Click 'Forgot Password'..."
}
```

### CLI Smoke Test

```bash
python scripts/smoke_test_vertex.py
```

This will test all 6 agents with sample prompts and display results.

## Troubleshooting

### Error: "Your default credentials were not found"

**Solution 1**: Set `GOOGLE_APPLICATION_CREDENTIALS` in `.env`:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

**Solution 2**: Run `gcloud auth application-default login`

**Solution 3**: If on GCP, ensure the instance has Vertex AI User role

### Error: "Permission denied"

Your service account needs the "Vertex AI User" role:

```bash
gcloud projects add-iam-policy-binding genesis-finetuning-prod \
  --member="serviceAccount:YOUR_SA@genesis-finetuning-prod.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### Error: "Model not found"

Check that the model resource names in `.env` match the deployed models:

```bash
gcloud ai models list \
  --region=us-central1 \
  --project=genesis-finetuning-prod
```

### Fallback to Base Model

If a tuned model is not available, the system automatically falls back to `gemini-2.0-flash-001`. This is by design for graceful degradation.

## Cost Optimization

The tuned models are already deployed and ready to use. Costs are:

- **Inference**: ~$0.10 per 1K input tokens, ~$0.30 per 1K output tokens
- **Storage**: Minimal (models are hosted by Google)

**Tips**:
- Use caching for repeated queries
- Batch requests when possible
- Monitor usage in GCP Console > Vertex AI > Endpoints

## Production Deployment

For production:

1. **Use Workload Identity** (on GKE) or **Instance Service Accounts** (on GCE)
2. **Enable logging**: Check `config/production.yml` for observability settings
3. **Monitor costs**: Set up billing alerts in GCP Console
4. **Rate limiting**: The FastAPI route can be wrapped with rate limiters

## Files Created

- `infrastructure/vertex_client.py` - Core client for calling tuned models
- `api/routes/agents.py` - FastAPI endpoint for HTTP access
- `scripts/check_vertex_setup.py` - Setup verification tool
- `scripts/smoke_test_vertex.py` - Integration test for all 6 agents
- `docs/VERTEX_AI_SETUP.md` - This documentation

## Next Steps

1. Ensure your service account has proper permissions
2. Run `python scripts/check_vertex_setup.py` to verify setup
3. Test with `python scripts/smoke_test_vertex.py`
4. Integrate into your agents by importing `ask_agent` function
5. Deploy FastAPI endpoints for external access

## Support

For issues or questions:
- Check GCP Console > Vertex AI > Models for model status
- Review GCP Console > IAM for permission issues
- See logs in `logs/` directory for detailed error messages
