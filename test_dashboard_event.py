#!/usr/bin/env python3
"""Test script to debug dashboard event receiving"""
import requests
import json
import time

# Wait for API to be ready
print("Waiting for API to start...")
time.sleep(3)

# Send test event
payload = {
    'timestamp': '2025-11-21T01:00:00',
    'type': 'test',
    'business_name': 'test-business',
    'agent_name': 'Test Agent',
    'message': 'Test event',
    'data': {'test': 'data'}
}

try:
    print(f"Sending event: {json.dumps(payload, indent=2)}")
    resp = requests.post('http://localhost:8001/events', json=payload, timeout=5)
    print(f"Status Code: {resp.status_code}")
    print(f"Response: {resp.text}")

    if resp.status_code == 200:
        print("\n✅ Event successfully received!")
        # Try to fetch it back
        resp2 = requests.get('http://localhost:8001/events/recent?limit=1')
        print(f"\nRecent events: {json.dumps(resp2.json(), indent=2)}")
    else:
        print(f"\n❌ Error: {resp.text}")
except Exception as e:
    print(f"❌ Exception: {e}")
    import traceback
    traceback.print_exc()
