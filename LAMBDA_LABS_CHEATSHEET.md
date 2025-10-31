# Lambda Labs SAE Training: Command Reference

**Quick Lookup for Common Operations**

---

## SETUP (First Time Only)

```bash
# 1. Create account
https://cloud.lambda.ai/ → Sign Up → Add payment method

# 2. Get API key
Settings → API Keys → Create New Key
export LAMBDA_API_KEY="your-key"

# 3. Generate SSH key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/lambda_key -N ""
# Add to Lambda console: Settings → SSH Keys → Add SSH Key
```

---

## INSTANCE MANAGEMENT

```bash
# Check pricing & availability
python3 scripts/lambda_labs_launcher.py cost-estimate --hours 12 --instance-type a100
# Output: Cost breakdown with TUMIX savings

# Launch A100 instance (wait for ready)
python3 scripts/lambda_labs_launcher.py launch --instance-type a100 --wait
# Output: Instance ID and IP address

# List all instances
python3 scripts/lambda_labs_launcher.py list

# Show specific instance details
python3 scripts/lambda_labs_launcher.py show <instance-id>

# Terminate instance (CRITICAL!)
python3 scripts/lambda_labs_launcher.py terminate <instance-id> --force
```

---

## ON INSTANCE SETUP

```bash
# Connect via SSH
ssh -i ~/.ssh/lambda_key ubuntu@<instance-ip>

# Run environment setup (one-time)
bash setup_sae_training_env.sh
# Or if not on instance:
# scp -i ~/.ssh/lambda_key setup_sae_training_env.sh ubuntu@<ip>:~/
# ssh -i ~/.ssh/lambda_key ubuntu@<ip> 'bash ~/setup_sae_training_env.sh'

# Activate virtual environment
source /home/ubuntu/sae-training-venv/bin/activate

# Verify GPU
nvidia-smi
python3 -c "import torch; print(f'CUDA: {torch.cuda.is_available()}')"
```

---

## TRAINING EXECUTION

```bash
# Basic training (3 epochs, 12h, $15.48)
python3 train_sae_pii.py

# TUMIX early stopping (1 epoch, 6h, $7.74) **RECOMMENDED**
python3 train_sae_pii.py --enable-early-stopping --num-epochs 1 --batch-size 64

# Extended training (6 epochs)
python3 train_sae_pii.py --num-epochs 6

# With mixed precision (30-40% faster)
python3 train_sae_pii.py --enable-mixed-precision

# Custom output directory
python3 train_sae_pii.py --output-dir /path/to/models

# Custom batch size
python3 train_sae_pii.py --batch-size 64
```

---

## MONITORING (While Training)

```bash
# GPU usage (on instance, refresh every 1 sec)
watch -n 1 nvidia-smi

# Training logs (on instance)
tail -f /home/ubuntu/sae_training.log

# Instance status (local machine)
python3 scripts/lambda_labs_launcher.py list
```

---

## MODEL TRANSFER

```bash
# From local machine - Download trained models
mkdir -p /home/genesis/genesis-rebuild/models/sae-trained
scp -i ~/.ssh/lambda_key -r \
    ubuntu@<instance-ip>:/home/ubuntu/sae-models/* \
    /home/genesis/genesis-rebuild/models/sae-trained/

# Verify download
ls -lh /home/genesis/genesis-rebuild/models/sae-trained/
# sae_final.pt
# training_history.json

# From local machine - Upload code to instance
scp -i ~/.ssh/lambda_key \
    scripts/train_sae_pii.py \
    ubuntu@<instance-ip>:/home/ubuntu/
```

---

## COST TRACKING

```bash
# Cost estimate before launch
python3 scripts/lambda_labs_launcher.py cost-estimate --hours 12

# Check usage on instance (elapsed time)
ssh -i ~/.ssh/lambda_key ubuntu@<instance-ip> 'uptime'

# Lambda Labs Dashboard
https://cloud.lambda.ai/billing → Usage tab
```

---

## TROUBLESHOOTING

```bash
# GPU not detected
nvidia-smi  # If empty, drivers not installed
python3 -c "import torch; print(torch.cuda.is_available())"  # Should be True

# Out of memory
python3 train_sae_pii.py --batch-size 16  # Reduce batch size

# Training too slow
python3 train_sae_pii.py --enable-mixed-precision --batch-size 64

# SSH connection timeout
# Wait 2-3 minutes after launch for full boot
# Check instance status: python3 scripts/lambda_labs_launcher.py list

# Model download failed
# Check file exists on instance: ssh ... 'ls -la /home/ubuntu/sae-models/'
# Check local permissions: mkdir -p /path && chmod 755 /path
```

---

## CLEANUP (CRITICAL!)

```bash
# Check running instances
python3 scripts/lambda_labs_launcher.py list

# Terminate (stops charging)
python3 scripts/lambda_labs_launcher.py terminate <instance-id> --force

# Verify termination
python3 scripts/lambda_labs_launcher.py list  # Should be gone
```

---

## QUICK REFERENCE: 45-MINUTE WORKFLOW

```bash
# 1. Setup (local, 5 min)
export LAMBDA_API_KEY="your-key"

# 2. Launch (local, 3 min)
python3 scripts/lambda_labs_launcher.py launch --instance-type a100 --wait
# Copy IP address from output

# 3. Setup environment (remote, 10 min)
ssh -i ~/.ssh/lambda_key ubuntu@<IP>
bash setup_sae_training_env.sh
source /home/ubuntu/sae-training-venv/bin/activate

# 4. Copy code (local, 5 min)
scp -i ~/.ssh/lambda_key scripts/train_sae_pii.py ubuntu@<IP>:~/

# 5. Start training (remote, 1 min)
python3 train_sae_pii.py --enable-early-stopping

# 6. Monitor (remote, in another terminal)
watch -n 1 nvidia-smi
tail -f /home/ubuntu/sae_training.log

# 7. After training (local, 5 min) - THEN TERMINATE!
scp -i ~/.ssh/lambda_key -r ubuntu@<IP>:/home/ubuntu/sae-models/* ./
python3 scripts/lambda_labs_launcher.py terminate <instance-id> --force
```

---

## FILE LOCATIONS

| File | Location | Purpose |
|------|----------|---------|
| Main guide | `docs/LAMBDA_LABS_SAE_TRAINING_PROVISIONING.md` | 11-part detailed guide |
| Quick start | `docs/LAMBDA_LABS_QUICK_START.md` | Fast reference |
| Summary | `docs/LAMBDA_LABS_PROVISIONING_SUMMARY.md` | Complete overview |
| Cheatsheet | `LAMBDA_LABS_CHEATSHEET.md` | This file |
| Launcher | `scripts/lambda_labs_launcher.py` | Python CLI tool |
| Setup script | `scripts/setup_sae_training_env.sh` | Environment setup |
| Training script | `scripts/train_sae_pii.py` | SAE training |

---

## PYTHON API USAGE (Advanced)

```python
from scripts.lambda_labs_launcher import LambdaLabsClient, InstanceConfig

client = LambdaLabsClient()

# List instances
instances = client.list_instances()
for inst in instances:
    print(inst['id'], inst['status'], inst['ip'])

# Launch instance
config = InstanceConfig(instance_type="a100", region="us-west-1")
result = client.launch_instance(config)
instance_id = result['id']

# Get instance details
instance = client.get_instance(instance_id)
print(instance['ip'])

# Terminate
client.terminate_instance(instance_id)
```

---

## ENVIRONMENT VARIABLES

```bash
# Required
export LAMBDA_API_KEY="<your-api-key>"

# Optional (defaults shown)
export LAMBDA_SSH_KEY_NAME="sae-training"
export HF_HOME="/home/ubuntu/.cache/huggingface"
export TOKENIZERS_PARALLELISM="false"
```

---

## COST SUMMARY

| Scenario | Hours | Rate | Total |
|----------|-------|------|-------|
| Basic (3 epochs) | 12 | $1.29/hr | $15.48 |
| TUMIX (1 epoch) | 6 | $1.29/hr | $7.74 |
| Extended (6 epochs) | 24 | $1.29/hr | $30.96 |
| Safety buffer | - | - | +$5 |
| **Recommended budget** | - | - | **$25** |

**Always terminate instance after training!**

---

## HELPFUL LINKS

- API Docs: https://api.lambda.ai/docs
- Status: https://cloud.lambda.ai/instances
- Support: https://forum.lambda.ai/
- Genesis Status: `/home/genesis/genesis-rebuild/PROJECT_STATUS.md`

---

**Version:** 1.0
**Last Updated:** October 30, 2025
**Status:** Ready to use
