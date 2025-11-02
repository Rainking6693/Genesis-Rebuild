#!/bin/bash
# Quick status check for all Mistral fine-tuning jobs

export MISTRAL_API_KEY="8AhWXk5aqhlqLhPeXtgeftOzJsRWE4PQ"

echo "========================================"
echo "MISTRAL FINE-TUNING STATUS CHECK"
echo "========================================"
echo "Time: $(date)"
echo ""

echo "📊 All Jobs Status:"
echo "----------------------------------------"
python3 -c 'from mistralai import Mistral; import os; client = Mistral(api_key=os.environ["MISTRAL_API_KEY"]); jobs = client.fine_tuning.jobs.list();
for j in jobs.data[:8]:
    status_emoji = "✅" if j.status == "SUCCESS" else ("⏳" if j.status in ["QUEUED", "RUNNING", "VALIDATING"] else "❌")
    print(f"{status_emoji} {j.id}: {j.status}")
    if j.status == "SUCCESS":
        print(f"   Model: {j.fine_tuned_model}")
'

echo ""
echo "----------------------------------------"
echo "📈 Summary by Agent:"
echo "----------------------------------------"

for agent in content_agent legal_agent qa_agent support_agent analyst_agent; do
    if [ -f "models/${agent}_mistral/job_info.json" ]; then
        echo "🔹 $agent:"
        cat models/${agent}_mistral/job_info.json | python3 -c "import sys, json; d=json.load(sys.stdin); print(f'   Job: {d[\"job_id\"]}'); print(f'   Status: {d[\"status\"]}')"
        echo ""
    fi
done

echo "========================================"
echo "💡 Next Steps:"
echo "----------------------------------------"
echo "1. Wait for all jobs to complete (30-60 min)"
echo "2. Run benchmarks to validate quality"
echo "3. Update agent configs with model IDs"
echo "========================================"
