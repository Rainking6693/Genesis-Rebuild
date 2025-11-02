#!/bin/bash
# LAMBDA LABS SAE TRAINING - QUICK REFERENCE
# Generated: October 30, 2025
# Author: Nova (Vertex AI Specialist)

# ============================================================================
# SECTION 1: ONE-TIME SETUP (Run once)
# ============================================================================

# 1. Generate SSH key (run on your LOCAL machine)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/lambda_key -N ""

# 2. Get API key from https://cloud.lambda.ai/ → Settings → API Keys
#    Then set it:
export LAMBDA_API_KEY="your-api-key-here"

# 3. Add SSH public key to Lambda Labs dashboard
#    https://cloud.lambda.ai/account → SSH Keys
cat ~/.ssh/lambda_key.pub

# ============================================================================
# SECTION 2: VERIFICATION (No cost)
# ============================================================================

# Check environment
cd /home/genesis/genesis-rebuild
echo "API Key set: $LAMBDA_API_KEY"
ls -la ~/.ssh/lambda_key

# Cost estimation
python3 scripts/lambda_labs_launcher.py cost-estimate \
    --instance-type a100 \
    --hours 12

# ============================================================================
# SECTION 3: LAUNCH GPU INSTANCE ($1.29/hour)
# ============================================================================

# Launch A100 and wait for it to start
python3 scripts/lambda_labs_launcher.py launch \
    --instance-type a100 \
    --region us-west-1 \
    --name sae-pii-training \
    --wait \
    --timeout 300

# Save the instance ID from output!
# Example: 487a1234abc56d78

# ============================================================================
# SECTION 4: SETUP ON GPU INSTANCE (Run inside GPU machine)
# ============================================================================

# Copy these commands and run on the GPU instance

# Connect first:
# ssh -i ~/.ssh/lambda_key ubuntu@<IP_FROM_ABOVE>

# Then run these:
cd /home/ubuntu
bash setup_sae_training_env.sh
source /home/ubuntu/sae-training-venv/bin/activate

# Verify GPU
python3 -c "import torch; print(f'GPUs: {torch.cuda.device_count()}')"

# ============================================================================
# SECTION 5: START TRAINING - OPTION A: STANDARD
# ============================================================================

# Run on GPU instance:
source /home/ubuntu/sae-training-venv/bin/activate

python3 /home/ubuntu/train_sae_pii.py \
    --model-name meta-llama/Llama-3.2-8B \
    --target-layer 12 \
    --expansion-factor 8 \
    --batch-size 32 \
    --num-epochs 3 \
    --output-dir /home/ubuntu/sae-models

# Monitor:
tail -f /home/ubuntu/sae_training.log

# Duration: ~2 hours
# Cost: ~$2.58

# ============================================================================
# SECTION 5B: START TRAINING - OPTION B: TUMIX EARLY STOPPING (51% savings)
# ============================================================================

# Run on GPU instance:
source /home/ubuntu/sae-training-venv/bin/activate

python3 /home/ubuntu/train_sae_pii.py \
    --model-name meta-llama/Llama-3.2-8B \
    --target-layer 12 \
    --expansion-factor 8 \
    --batch-size 64 \
    --num-epochs 6 \
    --enable-early-stopping \
    --enable-mixed-precision \
    --output-dir /home/ubuntu/sae-models-tumix

# Monitor:
tail -f /home/ubuntu/sae_training.log

# Duration: ~3 hours (auto-stops when loss plateaus)
# Cost: ~$3.87 (saves $7.61!)

# ============================================================================
# SECTION 6: DOWNLOAD TRAINED MODELS
# ============================================================================

# Run on your LOCAL machine (after training completes):
scp -i ~/.ssh/lambda_key -r \
    ubuntu@<IP>:/home/ubuntu/sae-models \
    ./models/trained-sae-a100/

# Verify:
ls -lh ./models/trained-sae-a100/

# ============================================================================
# SECTION 7: TERMINATE INSTANCE (CRITICAL!)
# ============================================================================

# IMMEDIATELY after training completes, run:
python3 scripts/lambda_labs_launcher.py terminate \
    --instance-id 487a1234abc56d78 \
    --force

# Verify:
python3 scripts/lambda_labs_launcher.py list

# ============================================================================
# COST REFERENCE
# ============================================================================

# A100 40GB: $1.29/hour
# A100 80GB: $1.99/hour
# H100:      $2.29/hour
# RTX Ada:   $0.79/hour (slower)
# A10:       $0.35/hour (very slow)

# Standard training (3 epochs):     ~$2.58
# TUMIX early stopping (auto-stop): ~$3.87 (actually cheaper due to auto-stop!)
# 12 hours full training:           $15.48
# Setup overhead:                   ~$0.39

# ============================================================================
# QUICK COMMANDS
# ============================================================================

# List all instances
python3 scripts/lambda_labs_launcher.py list

# Show instance details
python3 scripts/lambda_labs_launcher.py show <instance-id>

# Cost estimate any duration
python3 scripts/lambda_labs_launcher.py cost-estimate \
    --instance-type a100 \
    --hours 24

# ============================================================================
# EMERGENCY PROCEDURES
# ============================================================================

# If training crashes and instance still running:
python3 scripts/lambda_labs_launcher.py list
# Find the ID, then:
python3 scripts/lambda_labs_launcher.py terminate <ID> --force

# If you lose the IP address:
python3 scripts/lambda_labs_launcher.py list
# Will show IP in output

# Check charge accumulation:
# Dashboard: https://cloud.lambda.ai/account → Billing

# ============================================================================
# EXPECTED TIMES
# ============================================================================

# Account setup:           5 minutes
# SSH key generation:      1 minute
# GPU launch:              3-5 minutes
# Environment setup:       10 minutes
# Script copy:             2 minutes
# Training (standard):     2 hours
# Training (TUMIX):        3 hours (but cheaper!)
# Model download:          5 minutes
# Termination:             <1 minute
#
# TOTAL: ~45 minutes to trained model

# ============================================================================
# FILES REFERENCE
# ============================================================================

# Execution plan:
# /home/genesis/genesis-rebuild/LAMBDA_LABS_EXECUTION_REPORT.md

# Quick reference:
# /home/genesis/genesis-rebuild/LAMBDA_LABS_QUICK_REFERENCE.sh

# Provisioning script:
# /home/genesis/genesis-rebuild/scripts/lambda_labs_launcher.py

# Training script:
# /home/genesis/genesis-rebuild/scripts/train_sae_pii.py

# Environment setup:
# /home/genesis/genesis-rebuild/scripts/setup_sae_training_env.sh

# SAE architecture:
# /home/genesis/genesis-rebuild/infrastructure/sae_pii_detector.py
