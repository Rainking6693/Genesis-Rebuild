#!/usr/bin/env python3
"""
Update dashboard on PythonAnywhere with error monitoring
"""
import requests

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"

print("="*70)
print("UPDATING DASHBOARD WITH ERROR MONITORING")
print("="*70)

# Read files
files_to_upload = {
    'metrics_collector.py': '/home/genesis/genesis-rebuild/dashboard/metrics_collector.py',
    'static/js/dashboard.js': '/home/genesis/genesis-rebuild/dashboard/static/js/dashboard.js'
}

print("\n📤 Uploading updated files...")
for remote_path, local_path in files_to_upload.items():
    with open(local_path, 'r') as f:
        content = f.read()

    url = f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/home/{USERNAME}/genesis-rebuild/dashboard/{remote_path}'
    response = requests.post(
        url,
        headers={'Authorization': f'Token {API_TOKEN}'},
        files={'content': content.encode('utf-8')}
    )

    if response.status_code in [200, 201]:
        print(f"  ✓ {remote_path}")
    else:
        print(f"  ✗ {remote_path}: {response.status_code}")

# Reload
print("\n🔄 Reloading webapp...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/webapps/{USERNAME}.pythonanywhere.com/reload/',
    headers={'Authorization': f'Token {API_TOKEN}'}
)

if response.status_code == 200:
    print("✓ Webapp reloaded")

import time
time.sleep(5)

# Test
print("\n🧪 Testing error monitoring...")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/api/metrics/orchestration')
if response.status_code == 200:
    data = response.json()['data']
    if 'errors' in data:
        print(f"✓ Error monitoring active:")
        print(f"  • Total errors (24h): {data['errors']['total_errors_24h']}")
        print(f"  • API quota errors: {data['errors']['api_quota_errors']}")
        print(f"  • LLM failures: {data['errors']['llm_failures']}")
        print(f"  • Recent errors logged: {len(data['errors']['recent_errors'])}")
    else:
        print("✗ Error monitoring not found in response")
else:
    print(f"✗ API failed: {response.status_code}")

print("\n" + "="*70)
print("✅ DASHBOARD UPDATED WITH ERROR MONITORING")
print("="*70)
print(f"\n🎯 View errors at:")
print(f"   https://{USERNAME}.pythonanywhere.com/")
print(f"   → Click 'Orchestration' tab → Scroll to 'Error Monitoring'")
print("\nThe dashboard will now show:")
print("  • Real-time error counts")
print("  • API quota failures (429 errors)")
print("  • LLM generation failures")
print("  • Recent error log with timestamps")
print("  • Troubleshooting tips")
print("="*70)
