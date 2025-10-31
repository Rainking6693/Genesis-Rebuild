# DeepResearch Data Pipeline Rollout

**Status:** scaffolding + prompts + mock/real client support merged (October 30, 2025)

## What we now support

- `pipelines.deepresearch` package with:
  - `DeepResearchConfig` (API keys via env, OpenRouter-compatible endpoint support).
  - `DeepResearchPipeline` orchestrator with automatic fallback to a `DeepResearchClient` when `DEEPRESEARCH_API_BASE` and `OPENAI_API_KEY` are set, otherwise using the mock provider.
  - `DeepResearchClient` capable of calling any OpenAI-compatible endpoint (e.g., OpenRouter, Bailian) and gracefully falling back to the mock provider on network/auth failures.
- CLI runner `scripts/run_deepresearch_pipeline.py` (adds repo root to `sys.path`).
- Prompt templates for all 15 agents (`prompts/deepresearch/*.json`).
- Conversion helper `scripts/convert_deepresearch_to_unsloth.py` to translate generated JSONL into Unsloth fine-tuning format.
- Unit tests (`tests/test_deepresearch_pipeline.py`).

## Runbook

1. **Set up the official DeepResearch service**
   ```bash
   mkdir -p external
   git clone https://github.com/Alibaba-NLP/DeepResearch external/DeepResearch
   cd external/DeepResearch
   pip install -r requirements.txt
   cp .env.example .env  # populate SERPER_KEY_ID, JINA_API_KEYS, DASHSCOPE_API_KEY, OPENAI_API_KEY, etc.
   ```

2. **Export environment variables for the pipeline**
   ```bash
   export SERPER_API_KEY=...
   export JINA_API_KEY=...
   export DASHSCOPE_API_KEY=...
   export OPENAI_API_KEY=...             # reused by DeepResearch + Unsloth
   export DEEPRESEARCH_API_BASE=https://openrouter.ai/api
   export DEEPRESEARCH_MODEL=openrouter/alibaba/tongyi-deepresearch-30b
   ```
   Adjust `DEEPRESEARCH_API_BASE` if you host the DeepResearcher stack locally (any OpenAI-compatible `/v1/chat/completions` endpoint works).

3. **Generate the full dataset**
   ```bash
   ./venv/bin/python scripts/run_deepresearch_pipeline.py --batch-size 20
   ```
   Output path example: `data/deepresearch/20251030T171904Z/genesis_deepresearch.jsonl`.

4. **Convert to Unsloth format**
   ```bash
   ./venv/bin/python scripts/convert_deepresearch_to_unsloth.py \
       data/deepresearch/20251030T171904Z/genesis_deepresearch.jsonl \
       data/unsloth/qa_deepresearch.jsonl
   ```
   Merge the converted file with Phase 5 corpora and update the fine-tuning manifest.

5. **Run Unsloth fine-tune (pilot: QA agent)**
   - Point Unsloth to the merged JSONL dataset.
   - Monitor training loss + evaluation metrics; compare against pre-DeepResearch baseline.
   - Repeat for additional agents once QA pilot shows lift.

6. **Quality control**
   - Hudson to review 10% sample ⇒ store feedback under `reports/deepresearch/<timestamp>_qc.md`.
   - Log dataset path + metrics in `docs/PROJECT_STATUS.md` (Phase 7 section).

## Notes

- `DeepResearchClient` returns mock data automatically if the live service call fails, so the pipeline remains usable in offline CI.
- The CLI supports `--max-examples` for dry runs: `./venv/bin/python scripts/run_deepresearch_pipeline.py --max-examples 100 --batch-size 5`.
- The conversion script preserves `agent`, `topic`, and `citations` fields for traceability within Unsloth jobs.

Sample run (mock provider) generated: `data/deepresearch/20251030T181134Z/genesis_deepresearch.jsonl` and its Unsloth counterpart `data/deepresearch/20251030T181134Z/genesis_deepresearch_unsloth.jsonl`.
Pilot run against OpenAI Responses API (real provider) generated: `data/deepresearch/20251030T193412Z/genesis_deepresearch.jsonl` (1 example, `gpt-4.1` model). Use this to validate downstream tooling before firing the 20k-example job.
