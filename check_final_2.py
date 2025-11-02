#!/usr/bin/env python3
from mistralai import Mistral
import os

client = Mistral(api_key=os.environ["MISTRAL_API_KEY"])

jobs_to_check = [
    ("f997bebc-66d3-4be7-a031-43d1fded29a3", "support_agent"),
    ("9ae05c7c-e01f-4c78-a7cd-159b5ffb58d1", "analyst_agent")
]

print("="*60)
print("FINAL 2 GENESIS AGENTS - STATUS CHECK")
print("="*60)
print()

for job_id, agent_name in jobs_to_check:
    job = client.fine_tuning.jobs.get(job_id=job_id)

    status_emoji = "✅" if job.status == "SUCCESS" else ("⏳" if job.status in ["QUEUED", "RUNNING", "VALIDATING"] else "❌")

    print(f"{status_emoji} {agent_name.upper()}")
    print(f"   Job ID: {job_id}")
    print(f"   Status: {job.status}")

    if job.status == "SUCCESS":
        print(f"   ✅ Model ID: {job.fine_tuned_model}")
    elif job.status in ["QUEUED", "RUNNING", "VALIDATING"]:
        print(f"   ⏳ Still processing...")
    elif hasattr(job, 'events') and job.events:
        print(f"   Last events:")
        for event in job.events[-2:]:
            if 'error' in event.data:
                print(f"      Error: {event.data['error']}")

    print()

print("="*60)
