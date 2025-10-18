"""
Test script for A2A service endpoints.
Run the service first: uvicorn a2a_service:app --reload
Then run this test: python test_a2a_service.py
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_card_endpoint():
    """Test GET /a2a/card endpoint."""
    print("\n=== Testing GET /a2a/card ===")
    response = requests.get(f"{BASE_URL}/a2a/card")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    assert "name" in response.json()
    assert response.json()["name"] == "Genesis"
    print("✓ Card endpoint test passed")

def test_invoke_endpoint():
    """Test POST /a2a/invoke endpoint."""
    print("\n=== Testing POST /a2a/invoke ===")
    payload = {"message": "Please echo 'Hello from A2A!'"}
    response = requests.post(f"{BASE_URL}/a2a/invoke", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    assert "reply" in response.json()
    print("✓ Invoke endpoint test passed")

def test_invoke_empty_message():
    """Test POST /a2a/invoke with empty message (should fail)."""
    print("\n=== Testing POST /a2a/invoke with empty message ===")
    payload = {"message": ""}
    response = requests.post(f"{BASE_URL}/a2a/invoke", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 400
    print("✓ Empty message validation test passed")

if __name__ == "__main__":
    try:
        test_card_endpoint()
        test_invoke_endpoint()
        test_invoke_empty_message()
        print("\n✅ All A2A service tests passed!")
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to service.")
        print("Make sure the service is running:")
        print("  uvicorn a2a_service:app --reload")
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
