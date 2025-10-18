#!/bin/bash
# Quick A2A Service Test - 3 Key Agents

echo "=========================================="
echo "GENESIS A2A SERVICE - QUICK TEST"
echo "=========================================="
echo ""

# Test 1: Check service version
echo "Test 1: Service Version"
curl -s http://127.0.0.1:8080/a2a/version | jq .
echo ""

# Test 2: List all agents
echo "Test 2: List All Agents"
curl -s http://127.0.0.1:8080/a2a/agents | jq .
echo ""

# Test 3: Marketing Agent - Create Strategy
echo "Test 3: Marketing Agent - Create Strategy"
curl -s -X POST http://127.0.0.1:8080/a2a/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"marketing.create_strategy","arguments":{"business_name":"QuickTest","target_audience":"Developers","budget":1000.0}}' \
  | jq -r '.result' | jq -r '.business_name, .budget, (.channels | length)'
echo ""

# Test 4: Builder Agent - Generate Frontend
echo "Test 4: Builder Agent - Generate Frontend"
curl -s -X POST http://127.0.0.1:8080/a2a/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"builder.generate_frontend","arguments":{"app_name":"TestApp","features":["Dashboard"],"pages":["Home"]}}' \
  | jq -r '.result' | jq -r '.app_name, .framework, .file_count'
echo ""

# Test 5: Content Agent - Write Blog Post
echo "Test 5: Content Agent - Write Blog Post"
curl -s -X POST http://127.0.0.1:8080/a2a/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"content.write_blog_post","arguments":{"title":"Test Post","keywords":["test","blog"],"word_count":500}}' \
  | jq -r '.result' | jq -r '.title, .word_count'
echo ""

echo "=========================================="
echo "A2A QUICK TEST COMPLETE"
echo "=========================================="
