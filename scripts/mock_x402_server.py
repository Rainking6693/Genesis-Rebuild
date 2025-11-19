#!/usr/bin/env python3
"""Mock X402 payment facilitator server for testing"""
import json
import logging
import uuid
from flask import Flask, request, jsonify

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/v1/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

@app.route('/v1/x402/payments', methods=['POST'])
def create_payment():
    """Mock payment creation endpoint"""
    try:
        payload = request.json
        logger.info(f"Received payment request: {payload}")

        response = {
            "transaction_id": str(uuid.uuid4()),
            "amount_usdc": payload.get("amount_usdc", 0.0),
            "token": payload.get("token", "USDC"),
            "vendor": payload.get("vendor", "unknown"),
            "status": "completed",
            "blockchain_tx_hash": f"0x{uuid.uuid4().hex}",
            "message": "Mock payment successful",
            "metadata": payload.get("metadata", {})
        }

        logger.info(f"Returning mock response: {response}")
        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error processing payment: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info("🚀 Starting mock X402 payment facilitator on port 9402...")
    app.run(host='0.0.0.0', port=9402, debug=False)
