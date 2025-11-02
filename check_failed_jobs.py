#!/usr/bin/env python3
from mistralai import Mistral
import os

client = Mistral(api_key=os.environ["MISTRAL_API_KEY"])

failed_job_ids = [
    ("240b5b0f-1c58-4d4a-b0b6-8e047cfe1777", "analyst_agent"),
    ("5b5d5ac5-b0cb-4ec7-b00e-2a75a3a03234", "support_agent"),
    ("c7a310e7-8627-44b5-be46-488752b25840", "qa_agent"),
]

for job_id, agent_name in failed_job_ids:
    job = client.fine_tuning.jobs.get(job_id=job_id)
    print("\n" + "="*60)
    print(f"Agent: {agent_name}")
    print(f"Job ID: {job_id}")
    print(f"Status: {job.status}")
    print(f"Full job object: {job}")
