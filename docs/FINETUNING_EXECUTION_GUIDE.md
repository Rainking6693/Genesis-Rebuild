# Fine-Tuning Execution Guide

## Current Execution Status

**Status:** ✅ EXECUTION STARTED
**Date:** October 31, 2025
**Time:** 20:34 UTC

All 5 agents are currently fine-tuning in parallel using GPT-4o-mini backend.

## Execution Details

- **Backend:** GPT-4o-mini (OpenAI)
- **Agents:** qa_agent, support_agent, legal_agent, analyst_agent, content_agent
- **Examples per agent:** Full dataset (~20,000 each)
- **Total examples:** ~99,990 (from 5 training files)
- **Execution mode:** Parallel (all 5 agents simultaneously)
- **Expected duration:** 5-9 hours
- **Expected cost:** $96.53

## Monitoring

### Check Process Status

```bash
# View all running fine-tuning processes
ps aux | grep finetune_agent | grep -v grep

# Count running processes (should be 5)
ps aux | grep finetune_agent | grep -v grep | wc -l
```

### View Logs

```bash
# Main execution log
tail -f logs/finetuning_execution.log

# Individual agent logs
tail -f logs/finetuning/qa_agent_gpt4o-mini_full.log
tail -f logs/finetuning/support_agent_gpt4o-mini_full.log
tail -f logs/finetuning/legal_agent_gpt4o-mini_full.log
tail -f logs/finetuning/analyst_agent_gpt4o-mini_full.log
tail -f logs/finetuning/content_agent_gpt4o-mini_full.log
```

### Check OpenAI Jobs

Once file uploads complete, check OpenAI fine-tuning jobs:

```bash
# Requires OPENAI_API_KEY to be set
python3 -c "import openai; jobs = openai.fine_tuning.jobs.list(limit=10); print([j.id + ' ' + j.status for j in jobs.data])"
```

## Expected Outputs

Each agent will produce:

1. **Training Report:** `models/{agent}_gpt4o-mini_full/training_report.json`
   - Contains job_id, model_id, training_file, config, elapsed_time, status

2. **Model ID:** Fine-tuned model ID from OpenAI (e.g., `ft:gpt-4o-mini-2024-07-18:org-name:model-id:timestamp`)

3. **Logs:** Detailed logs in `logs/finetuning/{agent}_gpt4o-mini_full.log`

## Completion Checklist

- [ ] qa_agent - Training complete
- [ ] support_agent - Training complete  
- [ ] legal_agent - Training complete
- [ ] analyst_agent - Training complete
- [ ] content_agent - Training complete
- [ ] All training reports generated
- [ ] All model IDs collected
- [ ] Cost verification complete

## Important Notes

### API Key Configuration

⚠️ **CRITICAL:** Ensure `OPENAI_API_KEY` environment variable is set:

```bash
export OPENAI_API_KEY="sk-..."
```

If not set, fine-tuning jobs will fail during file upload or job creation.

### Process Persistence

- Execution runs via `nohup`, so processes persist even if terminal disconnects
- Jobs continue in background
- Check logs to monitor progress

### Fine-Tuning Stages

1. **File Upload** (~5-10 minutes per agent)
   - Training data uploaded to OpenAI
   - File ID returned

2. **Job Creation** (~1 minute)
   - Fine-tuning job created with hyperparameters
   - Job ID returned

3. **Training** (~4-8 hours)
   - OpenAI processes training data
   - Status: `queued` → `running` → `succeeded` or `failed`

4. **Model Available** (immediate after success)
   - Fine-tuned model ID available
   - Can be used via OpenAI API

## Troubleshooting

### If processes fail to start

```bash
# Check if OpenAI package is installed
python3 -c "import openai; print('OK')"

# Check API key
python3 -c "import os; print('API Key:', 'SET' if os.getenv('OPENAI_API_KEY') else 'NOT SET')"

# Re-run manually for single agent
python3 scripts/finetune_agent.py \
    --agent qa_agent \
    --backend gpt4o-mini \
    --train_data data/unsloth_format/qa_agent_training.jsonl \
    --output_dir models/qa_agent_gpt4o-mini_full \
    --epochs 3 \
    --log_file logs/finetuning/qa_agent_gpt4o-mini_full.log
```

### If jobs stuck in "queued" status

- OpenAI fine-tuning queue can be busy
- Jobs will process automatically when resources available
- Check status periodically: `openai fine_tuning.jobs.retrieve(job_id)`

### View detailed errors

```bash
# Check individual agent logs for errors
grep -i error logs/finetuning/*_full.log
grep -i fail logs/finetuning/*_full.log
```

## Next Steps After Completion

1. **Verify all jobs succeeded**
   - Check training_report.json files
   - Verify model IDs are present

2. **Run benchmarks**
   ```bash
   for agent in qa_agent support_agent legal_agent analyst_agent content_agent; do
       python3 scripts/benchmark_finetuned.py \
           --model models/${agent}_gpt4o-mini_full \
           --benchmark genesis-custom \
           --agent $agent \
           --output_dir results/${agent}_gpt4o-mini_full
   done
   ```

3. **Generate report**
   ```bash
   python3 scripts/generate_finetuning_report.py \
       --results_dir results/ \
       --models_dir models/ \
       --output reports/finetuning_results.md
   ```

4. **Cost verification**
   - Check OpenAI dashboard for actual costs
   - Compare against expected $96.53

## Cost Breakdown

- **Training data:** ~100k examples
- **Estimated tokens:** ~50M tokens (rough estimate)
- **GPT-4o-mini training:** $0.001/1K tokens
- **Expected cost:** $96.53 for 5 agents
- **Per agent:** ~$19.31

*Note: Actual costs may vary based on token count and OpenAI pricing*

