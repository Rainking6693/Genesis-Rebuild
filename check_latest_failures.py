#!/usr/bin/env python3
from mistralai import Mistral
import os

client = Mistral(api_key=os.environ["MISTRAL_API_KEY"])

# New restart job IDs that failed
failed_job_ids = [
    ("c050beb1-93bd-4f95-897b-d691fdd8996c", "analyst_agent"),
    ("491d4d2c-2580-4e18-a216-f8b8ce3dea6c", "support_agent"),
]

for job_id, agent_name in failed_job_ids:
    job = client.fine_tuning.jobs.get(job_id=job_id)
    print("\n" + "="*60)
    print(f"Agent: {agent_name}")
    print(f"Job ID: {job_id}")
    print(f"Status: {job.status}")

    # Get last event for error details
    if hasattr(job, 'events') and job.events:
        print("\n📋 Last Events:")
        for event in job.events[-3:]:  # Last 3 events
            print(f"  - {event.name}: {event.data}")
