# Vertex AI GCP Credentials Setup Guide

**Last Updated:** November 4, 2025  
**Purpose:** Configure Google Cloud credentials for Vertex AI model deployment

---

## 📋 What are GCP Credentials?

**GCP (Google Cloud Platform) Credentials** are authentication files that allow your Genesis system to securely access Google Cloud services like Vertex AI.

### Types of Credentials

1. **Service Account Key (JSON file)** - Recommended for production
   - A JSON file containing private key and authentication details
   - Used by applications to authenticate without user interaction
   - Can be scoped to specific permissions

2. **User Account Credentials** - For development only
   - OAuth2 tokens from `gcloud auth login`
   - Temporary, requires re-authentication
   - Not suitable for production

3. **Application Default Credentials (ADC)** - Auto-detected
   - Google Cloud automatically finds credentials in standard locations
   - Works on GCE, GKE, Cloud Run (no setup needed)
   - Falls back to service account key if specified

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- Google Cloud Project with Vertex AI API enabled
- Billing account linked to project
- `gcloud` CLI installed (optional but recommended)

### Step 1: Install Google Cloud SDK (if not installed)

```bash
# Linux/macOS
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Verify installation
gcloud version
```

### Step 2: Create Service Account

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Create service account
gcloud iam service-accounts create genesis-vertex-sa \
    --display-name="Genesis Vertex AI Service Account" \
    --description="Service account for Genesis Meta-Agent Vertex AI access"

# Get service account email
export SA_EMAIL="genesis-vertex-sa@${PROJECT_ID}.iam.gserviceaccount.com"
echo "Service Account: $SA_EMAIL"
```

### Step 3: Grant Permissions

```bash
# Required permissions for Vertex AI
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/aiplatform.user"

# For model upload (access to GCS buckets)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/storage.objectAdmin"

# For service management
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/serviceusage.serviceUsageConsumer"
```

### Step 4: Create and Download Key

```bash
# Create JSON key file
gcloud iam service-accounts keys create ~/genesis-vertex-key.json \
    --iam-account=$SA_EMAIL

# Secure the key file
chmod 600 ~/genesis-vertex-key.json

# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/genesis-vertex-key.json"

echo "✅ Credentials saved to: $GOOGLE_APPLICATION_CREDENTIALS"
```

### Step 5: Enable Vertex AI API

```bash
# Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable compute.googleapis.com

echo "✅ Vertex AI APIs enabled"
```

### Step 6: Verify Setup

```bash
# Test authentication
gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS

# Test Vertex AI access
gcloud ai models list --region=us-central1

echo "✅ GCP credentials configured successfully!"
```

---

## 🔧 Configure Genesis to Use Credentials

### Option 1: Environment Variables (Recommended)

Add to your `.env` file or shell profile:

```bash
# GCP Credentials
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/genesis-vertex-key.json"
export VERTEX_PROJECT_ID="your-project-id"
export VERTEX_LOCATION="us-central1"
export VERTEX_STAGING_BUCKET="gs://genesis-vertex-staging"
```

### Option 2: Genesis Configuration File

Create `infrastructure/config/vertex_config.json`:

```json
{
  "project_id": "your-project-id",
  "location": "us-central1",
  "staging_bucket": "gs://genesis-vertex-staging",
  "credentials_path": "/path/to/genesis-vertex-key.json",
  "enable_vertex": true
}
```

### Option 3: Direct Code Configuration

```python
import os
from infrastructure.vertex_deployment import VertexDeploymentManager
from infrastructure.vertex_router import VertexModelRouter

# Set credentials programmatically
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/path/to/genesis-vertex-key.json"

# Initialize manager
manager = VertexDeploymentManager(
    project_id="your-project-id",
    location="us-central1",
    staging_bucket="gs://genesis-vertex-staging",
    enable_vertex=True  # Enable live Vertex AI mode
)

# Initialize router
router = VertexModelRouter(
    project_id="your-project-id",
    location="us-central1",
    enable_vertex=True
)
```

---

## 🗂️ Create GCS Staging Bucket

Vertex AI needs a GCS bucket for staging model artifacts:

```bash
# Create bucket
export BUCKET_NAME="genesis-vertex-staging"
gsutil mb -p $PROJECT_ID -l us-central1 gs://$BUCKET_NAME/

# Set bucket permissions
gsutil iam ch serviceAccount:${SA_EMAIL}:objectAdmin gs://$BUCKET_NAME

# Create directory structure
gsutil mkdir gs://$BUCKET_NAME/models/
gsutil mkdir gs://$BUCKET_NAME/endpoints/

echo "✅ Staging bucket created: gs://$BUCKET_NAME"
```

---

## 📦 Upload Mistral Models to GCS

Before deploying to Vertex AI, upload your fine-tuned models:

```bash
# Upload model artifacts
gsutil -m cp -r /path/to/mistral-qa-tuned gs://$BUCKET_NAME/models/mistral-qa-v1/
gsutil -m cp -r /path/to/mistral-support-tuned gs://$BUCKET_NAME/models/mistral-support-v1/
gsutil -m cp -r /path/to/mistral-legal-tuned gs://$BUCKET_NAME/models/mistral-legal-v1/
gsutil -m cp -r /path/to/mistral-sales-tuned gs://$BUCKET_NAME/models/mistral-sales-v1/
gsutil -m cp -r /path/to/mistral-analyst-tuned gs://$BUCKET_NAME/models/mistral-analyst-v1/
gsutil -m cp -r /path/to/mistral-devops-tuned gs://$BUCKET_NAME/models/mistral-devops-v1/
gsutil -m cp -r /path/to/mistral-customer-tuned gs://$BUCKET_NAME/models/mistral-customer-v1/

# Verify uploads
gsutil ls gs://$BUCKET_NAME/models/

echo "✅ All 7 Mistral models uploaded"
```

---

## 🔒 Security Best Practices

### 1. Never Commit Credentials to Git

```bash
# Add to .gitignore
echo "*.json" >> .gitignore
echo "*-key.json" >> .gitignore
echo ".env" >> .gitignore
```

### 2. Use Secret Management

**Option A: Google Secret Manager**
```bash
# Store key in Secret Manager
gcloud secrets create genesis-vertex-key \
    --data-file=$GOOGLE_APPLICATION_CREDENTIALS

# Grant access to service account
gcloud secrets add-iam-policy-binding genesis-vertex-key \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/secretmanager.secretAccessor"
```

**Option B: HashiCorp Vault**
```bash
vault kv put secret/genesis/vertex \
    credentials=@$GOOGLE_APPLICATION_CREDENTIALS
```

### 3. Rotate Keys Regularly

```bash
# Create new key
gcloud iam service-accounts keys create ~/genesis-vertex-key-new.json \
    --iam-account=$SA_EMAIL

# Test new key
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/genesis-vertex-key-new.json"
# Run tests...

# Delete old key (get KEY_ID from list command)
gcloud iam service-accounts keys list --iam-account=$SA_EMAIL
gcloud iam service-accounts keys delete KEY_ID --iam-account=$SA_EMAIL
```

### 4. Use Least Privilege

Only grant necessary permissions:

```bash
# Minimal permissions for Vertex AI
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/aiplatform.user" \
    --condition=None

# Restrict to specific regions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/aiplatform.user" \
    --condition='expression=resource.name.startsWith("projects/'$PROJECT_ID'/locations/us-central1/"),title=us-central1-only'
```

---

## 🧪 Test Your Setup

Create `scripts/test_vertex_credentials.py`:

```python
#!/usr/bin/env python3
"""Test Vertex AI credentials and access."""

import os
from google.cloud import aiplatform

def test_credentials():
    """Test GCP credentials and Vertex AI access."""
    
    # Check environment variables
    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    project_id = os.getenv("VERTEX_PROJECT_ID", "")
    location = os.getenv("VERTEX_LOCATION", "us-central1")
    
    if not credentials_path:
        print("❌ GOOGLE_APPLICATION_CREDENTIALS not set")
        return False
    
    if not os.path.exists(credentials_path):
        print(f"❌ Credentials file not found: {credentials_path}")
        return False
    
    print(f"✅ Credentials file: {credentials_path}")
    print(f"✅ Project ID: {project_id}")
    print(f"✅ Location: {location}")
    
    # Initialize Vertex AI
    try:
        aiplatform.init(project=project_id, location=location)
        print("✅ Vertex AI initialized")
    except Exception as e:
        print(f"❌ Vertex AI initialization failed: {e}")
        return False
    
    # List models (should return empty list or existing models)
    try:
        models = aiplatform.Model.list()
        print(f"✅ Vertex AI access verified ({len(models)} models found)")
        return True
    except Exception as e:
        print(f"❌ Vertex AI access failed: {e}")
        return False

if __name__ == "__main__":
    success = test_credentials()
    exit(0 if success else 1)
```

Run the test:

```bash
chmod +x scripts/test_vertex_credentials.py
python scripts/test_vertex_credentials.py
```

---

## 💰 Cost Considerations

### Vertex AI Pricing (as of Nov 2025)

| Resource | Cost |
|----------|------|
| Model upload | Free |
| Endpoint (idle) | $0.36/hour |
| Prediction (n1-standard-4) | $0.36/hour + $0.10/hour per replica |
| Prediction requests | $0.15 per 1000 predictions |
| Storage (GCS) | $0.020/GB/month |

### Cost Optimization Tips

1. **Use autoscaling:** Set `min_replica_count=1`, `max_replica_count=5`
2. **Delete unused endpoints:** Idle endpoints still cost $0.36/hour
3. **Use traffic splitting:** Test with 10% traffic before full rollout
4. **Monitor usage:** Set up billing alerts

```bash
# Create billing budget alert
gcloud billing budgets create \
    --billing-account=BILLING_ACCOUNT_ID \
    --display-name="Vertex AI Budget" \
    --budget-amount=1000 \
    --threshold-rule=percent=50 \
    --threshold-rule=percent=90 \
    --threshold-rule=percent=100
```

---

## 🔍 Troubleshooting

### Error: "Permission denied"

```bash
# Check service account permissions
gcloud projects get-iam-policy $PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:${SA_EMAIL}"

# Re-grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/aiplatform.user"
```

### Error: "API not enabled"

```bash
# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com

# Check API status
gcloud services list --enabled | grep aiplatform
```

### Error: "Credentials not found"

```bash
# Verify credentials file exists
ls -la $GOOGLE_APPLICATION_CREDENTIALS

# Test credentials manually
gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
```

### Error: "Quota exceeded"

```bash
# Check quotas
gcloud compute project-info describe --project=$PROJECT_ID

# Request quota increase (via GCP Console)
# https://console.cloud.google.com/iam-admin/quotas
```

---

## 📚 Additional Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/best-practices-service-accounts)
- [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)
- [GCP Security Best Practices](https://cloud.google.com/security/best-practices)

---

## ✅ Quick Checklist

Before deploying to production:

- [ ] GCP project created
- [ ] Billing account linked
- [ ] Vertex AI API enabled
- [ ] Service account created
- [ ] IAM permissions granted
- [ ] JSON key file downloaded
- [ ] Key file secured (chmod 600)
- [ ] Environment variables set
- [ ] GCS staging bucket created
- [ ] Mistral models uploaded to GCS
- [ ] Credentials tested (test script passed)
- [ ] Billing alerts configured
- [ ] Key rotation schedule established

---

**Ready to deploy!** 🚀

Once setup is complete, Genesis can deploy all 7 Mistral models to Vertex AI automatically.

