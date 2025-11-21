#!/usr/bin/env python3
"""
Test Flask routing issue
"""
import requests

USERNAME = "rainking632"
API_TOKEN = "d96e5e35ee2070fd3d41f83ddb856859a7f4ea7d"

# Add a debug route to Flask app
updated_app = """\"\"\"
Genesis Dashboard - Flask Application with Real-time Metrics
\"\"\"
from flask import Flask, render_template, jsonify, Response
from metrics_collector import MetricsCollector
import os

app = Flask(__name__)

# Initialize metrics collector
BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
collector = MetricsCollector(base_path=BASE_PATH)


@app.route("/")
def index():
    \"\"\"Dashboard home page\"\"\"
    try:
        return render_template("index.html")
    except Exception as e:
        return f"<h1>Error loading template: {str(e)}</h1><p>Template path: {app.template_folder}</p><p>CWD: {os.getcwd()}</p>", 500


@app.route("/test-html")
def test_html():
    \"\"\"Test route that returns simple HTML\"\"\"
    return \"\"\"
    <!DOCTYPE html>
    <html>
    <head><title>Genesis Real-Time Dashboard TEST</title></head>
    <body><h1>Flask is working! This is the NEW dashboard.</h1></body>
    </html>
    \"\"\"


@app.route("/debug")
def debug():
    \"\"\"Debug route\"\"\"
    import sys
    return jsonify({
        "template_folder": app.template_folder,
        "static_folder": app.static_folder,
        "cwd": os.getcwd(),
        "template_exists": os.path.exists(os.path.join(app.template_folder, "index.html")),
        "sys_path": sys.path[:5]
    })


@app.route("/api/health")
def health():
    \"\"\"Health check endpoint\"\"\"
    return jsonify({
        "status": "healthy",
        "service": "genesis-dashboard",
        "version": "1.0.0"
    })


@app.route("/api/metrics")
def get_all_metrics():
    \"\"\"Get all metrics\"\"\"
    try:
        metrics = collector.collect_all_metrics()
        return jsonify({
            "status": "success",
            "data": metrics
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route("/api/metrics/executive")
def get_executive_metrics():
    \"\"\"Get executive overview only\"\"\"
    try:
        metrics = collector._collect_executive_overview()
        return jsonify({
            "status": "success",
            "data": metrics
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route("/api/metrics/agents")
def get_agent_metrics():
    \"\"\"Get agent performance only\"\"\"
    try:
        metrics = collector._collect_agent_performance()
        return jsonify({
            "status": "success",
            "data": metrics
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route("/api/metrics/orchestration")
def get_orchestration_metrics():
    \"\"\"Get orchestration metrics only\"\"\"
    try:
        metrics = collector._collect_orchestration_metrics()
        return jsonify({
            "status": "success",
            "data": metrics
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route("/api/metrics/evolution")
def get_evolution_metrics():
    \"\"\"Get evolution metrics only\"\"\"
    try:
        metrics = collector._collect_evolution_metrics()
        return jsonify({
            "status": "success",
            "data": metrics
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route("/api/metrics/safety")
def get_safety_metrics():
    \"\"\"Get safety metrics only\"\"\"
    try:
        metrics = collector._collect_safety_metrics()
        return jsonify({
            "status": "success",
            "data": metrics
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route("/api/metrics/costs")
def get_cost_metrics():
    \"\"\"Get cost optimization metrics only\"\"\"
    try:
        metrics = collector._collect_cost_optimization()
        return jsonify({
            "status": "success",
            "data": metrics
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route("/api/snapshot", methods=["POST"])
def save_snapshot():
    \"\"\"Save metrics snapshot\"\"\"
    try:
        metrics = collector.collect_all_metrics()
        # Could save to file here
        return jsonify({
            "status": "success",
            "message": "Snapshot saved"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404


@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
"""

print("Uploading updated app.py with debug routes...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/files/path/home/{USERNAME}/genesis-rebuild/dashboard/app.py',
    headers={'Authorization': f'Token {API_TOKEN}'},
    files={'content': updated_app.encode('utf-8')}
)

print(f"Upload: {response.status_code}")

# Reload
print("Reloading...")
response = requests.post(
    f'https://www.pythonanywhere.com/api/v0/user/{USERNAME}/webapps/{USERNAME}.pythonanywhere.com/reload/',
    headers={'Authorization': f'Token {API_TOKEN}'}
)

import time
time.sleep(5)

# Test debug route
print("\nTesting debug route:")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/debug')
if response.status_code == 200:
    import json
    print(json.dumps(response.json(), indent=2))

# Test simple HTML route
print("\nTesting /test-html:")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/test-html')
if 'Flask is working' in response.text:
    print("✓ Flask routing works!")
else:
    print(f"✗ Issue: {response.text[:200]}")

# Test root
print("\nTesting / (root):")
response = requests.get(f'https://{USERNAME}.pythonanywhere.com/')
if 'Genesis Real-Time Dashboard' in response.text:
    print("✓ Root route serving Flask template!")
elif 'Error loading template' in response.text:
    print(f"✗ Template error: {response.text[:500]}")
else:
    print(f"✗ Still showing old dashboard")
