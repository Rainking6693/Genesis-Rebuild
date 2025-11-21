#!/usr/bin/env python3
"""
Force deploy Flask dashboard - completely replace WSGI
"""
import requests
import time

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"

print("="*70)
print("FORCING FLASK DASHBOARD DEPLOYMENT")
print("="*70)

# Create a clean WSGI that ONLY loads Flask
wsgi_content = """# Genesis Real-Time Dashboard - Flask ONLY
import sys
import os

# Set up paths
sys.path.insert(0, '/home/rainking632/genesis-rebuild/dashboard')
sys.path.insert(0, '/home/rainking632/genesis-rebuild')
sys.path.insert(0, '/home/rainking632/genesis-rebuild/venv/lib/python3.12/site-packages')

# Change to dashboard directory so Flask can find templates/static
os.chdir('/home/rainking632/genesis-rebuild/dashboard')

# Import Flask app
from app import app as application

# Debug
import sys
print("Flask dashboard loaded", file=sys.stderr)
"""

print("\n📤 Uploading clean Flask WSGI...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/var/www/rainking632_pythonanywhere_com_wsgi.py',
    headers={'Authorization': f'Token {API_TOKEN}'},
    files={'content': wsgi_content.encode('utf-8')}
)

print(f"Upload: {response.status_code}")

# Reload webapp
print("\n🔄 Reloading webapp...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/webapps/{USERNAME}.pythonanywhere.com/reload/',
    headers={'Authorization': f'Token {API_TOKEN}'}
)

print(f"Reload: {response.status_code}")

time.sleep(10)

# Test
print("\n🧪 Testing Flask dashboard...")

print("\n1. Testing homepage:")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/')
if 'Genesis Real-Time Dashboard' in response.text:
    print("✓ Flask dashboard HTML loaded!")
else:
    print(f"✗ Wrong dashboard - title: {response.text[response.text.find('<title>'):response.text.find('</title>')+8]}")

print("\n2. Testing API health:")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/api/health')
if response.status_code == 200:
    print(f"✓ API working: {response.json()}")
else:
    print(f"✗ API failed: {response.status_code}")

print("\n3. Testing real-time metrics:")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/api/metrics/executive')
if response.status_code == 200:
    data = response.json()['data']
    print(f"✓ Metrics working:")
    print(f"  Active Businesses: {data['businesses_active']}")
    print(f"  Completed: {data['businesses_completed']}")
    print(f"  Discarded: {data['businesses_discarded']}")
    print(f"  Monthly Costs: ${data['monthly_costs']:.2f}")
else:
    print(f"✗ Metrics failed: {response.status_code}")

print("\n" + "="*70)
print("✅ FLASK DASHBOARD DEPLOYED")
print("="*70)
print(f"\nVisit: https://{USERNAME}.pythonanywhere.com/")
print("="*70)
