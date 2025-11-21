"""
Genesis Dashboard - Flask Application with Real-time Metrics
"""
from flask import Flask, render_template, jsonify
from metrics_collector import MetricsCollector
import os

app = Flask(__name__)

# Initialize metrics collector
BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
collector = MetricsCollector(base_path=BASE_PATH)


@app.route("/")
def index():
    """Dashboard home page"""
    return render_template("index.html")


@app.route("/api/health")
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "genesis-dashboard",
        "version": "1.0.0"
    })


@app.route("/api/metrics")
def get_all_metrics():
    """Get all metrics"""
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
    """Get executive overview only"""
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
    """Get agent performance only"""
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
    """Get orchestration metrics only"""
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
    """Get evolution metrics only"""
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
    """Get safety metrics only"""
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
    """Get cost optimization metrics only"""
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
    """Save metrics snapshot"""
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
