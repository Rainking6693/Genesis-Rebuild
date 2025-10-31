# Lambda Labs SAE Training: Quick Start Guide

**Time to Production:** 45 minutes
**Cost:** $15.48 (12h A100) or $7.74 (6h with TUMIX early stopping)

---

## STEP 1: Account Setup (5 minutes)

```bash
# Create account at https://cloud.lambda.ai/
# 1. Sign up with email
# 2. Add payment method
# 3. Generate API key

export LAMBDA_API_KEY="your-api-key-here"
```

---

## STEP 2: Check Availability (2 minutes)

```bash
# Option A: Python script (recommended)
cd /home/genesis/genesis-rebuild

python3 scripts/lambda_labs_launcher.py cost-estimate --hours 12 --instance-type a100

# Output:
# Cost Estimate for A100:
#   Hourly Rate: $1.29
#   Training Hours: 12
#   Total Cost: $15.48
#
# With TUMIX Early Stopping (51% reduction):
#   Training Hours: 6.0
#   Total Cost: $7.74
```

---

## STEP 3: Launch Instance (5 minutes)

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/lambda_key -N ""

# Add to Lambda Labs dashboard:
# Settings → SSH Keys → Add SSH Key
# Paste contents of: cat ~/.ssh/lambda_key.pub

# Launch instance
python3 scripts/lambda_labs_launcher.py launch \
    --instance-type a100 \
    --region us-west-1 \
    --wait

# Output:
# Instance launched! ID: 487a1234abc56d78
# Waiting for instance to start...
# Instance is running!
# IP Address: 192.168.1.100
# Connect with:
#   ssh -i ~/.ssh/lambda_key ubuntu@192.168.1.100
```

---

## STEP 4: Setup Environment (10 minutes)

```bash
# Connect to instance
ssh -i ~/.ssh/lambda_key ubuntu@192.168.1.100

# Copy setup script and run
wget https://raw.githubusercontent.com/your-org/genesis-rebuild/main/scripts/setup_sae_training_env.sh
bash setup_sae_training_env.sh

# Activate environment
source /home/ubuntu/sae-training-venv/bin/activate

# Verify GPU
python3 -c "import torch; print(f'CUDA: {torch.cuda.is_available()}, GPUs: {torch.cuda.device_count()}')"
```

---

## STEP 5: Copy Code (5 minutes)

From your local machine:
```bash
# Copy Genesis code to instance
scp -i ~/.ssh/lambda_key -r \
    /home/genesis/genesis-rebuild/scripts/train_sae_pii.py \
    ubuntu@192.168.1.100:/home/ubuntu/

# Or clone from git
ssh -i ~/.ssh/lambda_key ubuntu@192.168.1.100 << 'EOF'
cd /home/ubuntu
git clone https://github.com/your-org/genesis-rebuild.git
EOF
```

---

## STEP 6: Run Training (12 hours for full, 6 hours with early stopping)

On the instance:
```bash
# Activate environment
source /home/ubuntu/sae-training-venv/bin/activate

# Basic training (3 epochs, ~12 hours)
python3 train_sae_pii.py \
    --model-name meta-llama/Llama-3.2-8B \
    --target-layer 12 \
    --expansion-factor 8 \
    --batch-size 32 \
    --num-epochs 3 \
    --output-dir /home/ubuntu/sae-models

# OR with TUMIX early stopping (1 epoch, ~6 hours)
python3 train_sae_pii.py \
    --model-name meta-llama/Llama-3.2-8B \
    --enable-early-stopping \
    --num-epochs 1 \
    --batch-size 64 \
    --output-dir /home/ubuntu/sae-models-tumix

# Monitor GPU in another terminal
watch -n 1 nvidia-smi

# Watch logs in another terminal
tail -f /home/ubuntu/sae_training.log
```

---

## STEP 7: Download Results (5 minutes)

From your local machine:
```bash
# Create local directory
mkdir -p /home/genesis/genesis-rebuild/models/sae-trained

# Download trained models
scp -i ~/.ssh/lambda_key -r \
    ubuntu@192.168.1.100:/home/ubuntu/sae-models/* \
    /home/genesis/genesis-rebuild/models/sae-trained/

# Verify
ls -lh /home/genesis/genesis-rebuild/models/sae-trained/
# sae_final.pt (trained weights)
# training_history.json (metrics)
```

---

## STEP 8: Terminate Instance (CRITICAL!)

```bash
# Terminate to avoid unexpected charges
python3 scripts/lambda_labs_launcher.py terminate <instance-id> --force

# Verify termination
python3 scripts/lambda_labs_launcher.py list
```

---

## COST BREAKDOWN

| Phase | Time | Rate | Cost |
|-------|------|------|------|
| Account setup | 5 min | $0 | $0 |
| Availability check | 2 min | $0 | $0 |
| Instance launch | 5 min | $0 (starting) | ~$0.10 |
| Environment setup | 10 min | $1.29/hr | ~$0.22 |
| Code copy | 5 min | $1.29/hr | ~$0.11 |
| Training (12h) | 12h | $1.29/hr | **$15.48** |
| Model download | 5 min | $1.29/hr | ~$0.11 |
| **Total** | **45 min + 12h** | | **$15.92** |

**With TUMIX Early Stopping:** $8.07 (51% savings)

---

## TROUBLESHOOTING

### GPU Not Found
```bash
# On instance
nvidia-smi
python3 -c "import torch; print(torch.cuda.is_available())"
```

### Out of Memory
```bash
# Reduce batch size
python3 train_sae_pii.py --batch-size 16

# Or reduce model (Llama 3.2 1B instead of 8B)
python3 train_sae_pii.py --hidden-dim 2048 --expansion-factor 8
```

### SSH Connection Timeout
```bash
# Wait 2-3 minutes for instance to fully boot
# Check instance status
python3 scripts/lambda_labs_launcher.py list

# Try different region if persistent
python3 scripts/lambda_labs_launcher.py launch --region us-east-1
```

---

## MONITORING CHECKLIST

- [ ] Instance is running: `python3 scripts/lambda_labs_launcher.py list`
- [ ] GPU is available: `nvidia-smi` on instance
- [ ] Training is progressing: `tail -f /home/ubuntu/sae_training.log`
- [ ] Cost hasn't exceeded budget: Check Lambda Labs dashboard
- [ ] Models are being saved: `ls -la /home/ubuntu/sae-models/`
- [ ] Instance terminated: Verify in Lambda Labs console

---

## NEXT STEPS

After training:

1. **Integrate Models:** Use trained SAE encoder in `infrastructure/sae_pii_detector.py`
2. **Train Classifiers:** Fine-tune XGBoost/Random Forest on labeled PII data
3. **Validate:** Achieve 96% F1 score on test set
4. **Deploy:** Integrate with WaltzRL safety feedback agent

See `docs/PHASE_7_SEVEN_ADDITIONS_OCT30_2025.md` for full roadmap.

---

## FILES CREATED

- `docs/LAMBDA_LABS_SAE_TRAINING_PROVISIONING.md` - Full 11-part guide
- `scripts/lambda_labs_launcher.py` - Python automation script
- `scripts/setup_sae_training_env.sh` - Environment setup script
- `scripts/train_sae_pii.py` - Training script for A100

---

## SUPPORT

**Lambda Labs:**
- Docs: https://docs.lambda.ai/
- Support: support@lambdalabs.com

**Genesis Project:**
- Status: `docs/PROJECT_STATUS.md`
- Mapping: `docs/AGENT_PROJECT_MAPPING.md`

