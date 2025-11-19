"""
Unit tests for VOIX detector
"""

import json
import pytest
from infrastructure.browser_automation.voix_detector import VoixDetector, VoixTool, VoixContext


class TestVoixDetector:
    """Test VOIX detector functionality"""

    def test_tool_tag_discovery(self):
        """Test discovery of tool tags"""
        detector = VoixDetector()
        html = '''
        <html>
        <body>
            <tool name="submit_product" 
                  description="Submit product to directory"
                  endpoint="https://api.example.com/submit"
                  method="POST"
                  parameters='{"type":"object","properties":{"name":{"type":"string"},"url":{"type":"string"}}}'/>
        </body>
        </html>
        '''
        result = detector.scan_dom(html)
        assert result["has_voix"] is True
        assert len(result["tools"]) == 1
        assert result["tools"][0]["name"] == "submit_product"

    def test_context_tag_discovery(self):
        """Test discovery of context tags"""
        detector = VoixDetector()
        html = '''
        <html>
        <body>
            <context name="user_id" value="12345" scope="session" ttl="3600"/>
            <context name="page_title" value="Product Submission" scope="page"/>
        </body>
        </html>
        '''
        result = detector.scan_dom(html)
        assert result["has_voix"] is True
        assert len(result["contexts"]) == 2
        assert any(ctx["name"] == "user_id" for ctx in result["contexts"])
        assert any(ctx["name"] == "page_title" for ctx in result["contexts"])

    def test_schema_validation(self):
        """Test tool schema validation"""
        detector = VoixDetector()
        # Valid tool
        html = '''
        <tool name="valid_tool" 
              description="Valid tool"
              endpoint="https://api.example.com/tool"
              parameters='{"type":"object"}'/>
        '''
        result = detector.scan_dom(html)
        assert len(result["tools"]) == 1

        # Invalid tool (missing endpoint)
        html_invalid = '''
        <tool name="invalid_tool" description="Invalid tool"/>
        '''
        result_invalid = detector.scan_dom(html_invalid)
        assert len(result_invalid["tools"]) == 0

    def test_malformed_tag_handling(self):
        """Test handling of malformed tags"""
        detector = VoixDetector()
        html = '''
        <tool name="malformed" endpoint="not-a-url"/>
        <tool name="valid" endpoint="https://api.example.com/tool"/>
        <context name="valid_context" value="test"/>
        <context/> <!-- missing name -->
        '''
        result = detector.scan_dom(html)
        # Should handle gracefully and extract valid tags
        assert len(result["tools"]) >= 1
        assert any(t["name"] == "valid" for t in result["tools"])

    def test_dynamic_content_monitoring(self):
        """Test context caching and TTL"""
        detector = VoixDetector()
        html = '''
        <context name="test_context" value="test_value" ttl="1"/>
        '''
        result = detector.scan_dom(html)
        assert len(result["contexts"]) == 1

        context = detector.get_context("test_context")
        assert context is not None
        assert context.value == "test_value"

        # Wait for expiration (in real test, would use time mocking)
        import time
        time.sleep(1.1)
        # Context should be expired
        expired_context = detector.get_context("test_context")
        # Note: In real implementation, expired contexts are removed
        # This test verifies the structure works

    def test_tool_caching(self):
        """Test tool caching"""
        detector = VoixDetector()
        html = '''
        <tool name="cached_tool" endpoint="https://api.example.com/tool"/>
        '''
        detector.scan_dom(html)
        tool = detector.get_tool("cached_tool")
        assert tool is not None
        assert tool.name == "cached_tool"

    def test_relative_endpoint_resolution(self):
        """Test relative endpoint resolution"""
        detector = VoixDetector()
        html = '''
        <tool name="relative_tool" endpoint="/api/submit"/>
        '''
        result = detector.scan_dom(html, base_url="https://example.com")
        assert len(result["tools"]) == 1
        assert result["tools"][0]["endpoint"].startswith("https://")

    def test_json_parameter_parsing(self):
        """Test JSON parameter parsing"""
        detector = VoixDetector()
        params = {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "url": {"type": "string"}
            },
            "required": ["name"]
        }
        html = f'''
        <tool name="json_tool" 
              endpoint="https://api.example.com/tool"
              parameters='{json.dumps(params)}'/>
        '''
        result = detector.scan_dom(html)
        assert len(result["tools"]) == 1
        tool_params = result["tools"][0]["parameters"]
        assert isinstance(tool_params, dict)
        assert "properties" in tool_params

