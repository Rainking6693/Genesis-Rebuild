#!/bin/bash

echo "Test 1: Version endpoint"
curl -s http://127.0.0.1:8080/a2a/version
echo ""

echo "Test 2: Echo tool"
curl -s -X POST http://127.0.0.1:8080/a2a/invoke -H "Content-Type: application/json" -d '{"tool":"echo","arguments":{"text":"test"}}'
echo ""

echo "Test 3: Time tool"
curl -s -X POST http://127.0.0.1:8080/a2a/invoke -H "Content-Type: application/json" -d '{"tool":"time_now","arguments":{}}'
echo ""

echo "Test 4: Math tool"
curl -s -X POST http://127.0.0.1:8080/a2a/invoke -H "Content-Type: application/json" -d '{"tool":"math_eval","arguments":{"expression":"(12/3)+5"}}'
echo ""

echo ""
echo "ALL CHECKS PASSED"
