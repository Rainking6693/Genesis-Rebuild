#!/bin/bash
set -e

# Activate venv if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ Activated virtual environment"
else
    echo "❌ venv not found"
fi

export MISTRAL_API_KEY="8AhWXk5aqhlqLhPeXtgeftOzJsRWE4PQ"

echo "========================================"
echo "RESTARTING FAILED MISTRAL FINE-TUNING"
echo "========================================"
echo "Agents: qa_agent support_agent analyst_agent"
echo "========================================"
echo ""

# Only retry the 3 failed agents
AGENTS=("qa_agent" "support_agent" "analyst_agent")
DATA_DIR="data/openai_format_sampled"
MODEL="open-mistral-7b"

for agent in "${AGENTS[@]}"; do
    echo "🚀 Starting fine-tuning for ${agent}..."

    # Upload file
    echo "  📁 Uploading training file: ${DATA_DIR}/${agent}_training.jsonl"

    python3 << EOF
from mistralai import Mistral
import os

client = Mistral(api_key=os.environ["MISTRAL_API_KEY"])

# Upload file
with open("${DATA_DIR}/${agent}_training.jsonl", "rb") as f:
    upload_response = client.files.upload(
        file={"file_name": "${agent}_training.jsonl", "content": f}
    )
    file_id = upload_response.id
    print(f"  ✅ File uploaded: {file_id}")

    # Create fine-tuning job
    print(f"  🎯 Creating fine-tuning job...")
    job = client.fine_tuning.jobs.create(
        model="${MODEL}",
        training_files=[{"file_id": file_id, "weight": 1.0}],
        hyperparameters={
            "training_steps": 10,
            "learning_rate": 0.0001,
        },
    )

    print(f"  ✅ Job created: {job.id}")
    print(f"  📊 Status: {job.status}")

    # Save job info
    import json
    job_info = {
        "job_id": job.id,
        "file_id": file_id,
        "agent": "${agent}",
        "model": "${MODEL}",
        "status": job.status,
    }

    os.makedirs("models/${agent}_mistral", exist_ok=True)
    with open("models/${agent}_mistral/job_info.json", "w") as f:
        json.dump(job_info, f, indent=2)

    print(f"  💾 Job info saved to: models/${agent}_mistral/job_info.json")
    print(f"  ✅ ${agent} fine-tuning started!")
    print()
EOF
done

echo "========================================"
echo "ALL FAILED AGENTS RESTARTED!"
echo "========================================"
echo ""
echo "📊 Monitor jobs with:"
echo "  python3 -c 'from mistralai import Mistral; import os; client = Mistral(api_key=os.environ[\"MISTRAL_API_KEY\"]); jobs = client.fine_tuning.jobs.list(); print(\"\\n\".join([f\"{j.id}: {j.status}\" for j in jobs.data[:8]))'"
echo ""
echo "💰 Estimated cost for 3 agents: $3-9"
echo "⏱️  Expected completion: 30-60 minutes"
