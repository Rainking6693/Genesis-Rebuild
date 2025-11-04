# Lambda Labs Training Package

## Contents
- `data/training/*.jsonl` - 99,990 cross-agent training examples (5 agents)
- `infrastructure/finetune/` - Unsloth fine-tuning pipeline
- `infrastructure/sae_pii_detector.py` - SAE PII detector

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install unsloth transformers datasets trl peft accelerate bitsandbytes xgboost scikit-learn
   ```

2. **Fine-tune agents (GPU 1):**
   ```bash
   # See train_all_agents.sh in LAMBDA_COMBINED_TRAINING_PLAN.md
   ```

3. **Train SAE PII (GPU 2 or sequential):**
   ```bash
   # See train_sae_pii.sh in LAMBDA_COMBINED_TRAINING_PLAN.md
   ```

## Expected Output
- 5 fine-tuned agent models (30-40% improved)
- SAE PII encoder (96% F1 score)
- PII classifiers (5 categories)

## Cost: ~$37-44 depending on parallel vs sequential
