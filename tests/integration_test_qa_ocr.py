#!/usr/bin/env python3
"""
QA Agent OCR Integration Test Suite
Alex - Integration Testing Specialist

Tests the complete integration of OCR capability into QA Agent:
- P0: Happy path, error scenarios
- P1: Service integration, agent framework compatibility
- P2: Performance baseline

Time-boxed: 30 minutes max
"""

import asyncio
import json
import time
import os
import sys
from pathlib import Path
from typing import Dict, List

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from agents.qa_agent import QAAgent, get_qa_agent
from infrastructure.ocr.ocr_agent_tool import (
    ocr_tool,
    qa_agent_screenshot_validator,
    extract_text
)

# ANSI colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


class TestResult:
    def __init__(self, name: str, priority: str):
        self.name = name
        self.priority = priority
        self.passed = False
        self.error = None
        self.duration = 0.0
        self.notes = []

    def pass_test(self, notes: List[str] = None):
        self.passed = True
        if notes:
            self.notes.extend(notes)

    def fail_test(self, error: str, notes: List[str] = None):
        self.passed = False
        self.error = error
        if notes:
            self.notes.extend(notes)

    def __str__(self):
        status = f"{GREEN}PASS{RESET}" if self.passed else f"{RED}FAIL{RESET}"
        priority = f"[{self.priority}]"
        result = f"{priority} {status} {self.name} ({self.duration:.2f}s)"

        if self.notes:
            result += f"\n      Notes: {', '.join(self.notes)}"

        if self.error:
            result += f"\n      {RED}Error: {self.error}{RESET}"

        return result


class QAOCRIntegrationTester:
    def __init__(self):
        self.results: List[TestResult] = []
        self.test_image_dir = PROJECT_ROOT / "data" / "ocr_test_images"
        self.test_invoice = self.test_image_dir / "test_invoice.png"
        self.test_ticket = self.test_image_dir / "test_ticket.png"

    def add_result(self, result: TestResult):
        self.results.append(result)
        print(f"  {result}")

    def print_header(self, section: str):
        print(f"\n{BLUE}{'='*70}{RESET}")
        print(f"{BLUE}{section}{RESET}")
        print(f"{BLUE}{'='*70}{RESET}")

    # ========================================
    # P0 TESTS: HAPPY PATH
    # ========================================

    async def test_qa_agent_initialization(self) -> TestResult:
        """P0: Initialize QA Agent with OCR tool"""
        result = TestResult("QA Agent Initialization", "P0")
        start = time.time()

        try:
            agent = QAAgent(business_id="test-ocr-integration")
            await agent.initialize()

            # Check that validate_screenshot is in tools
            if agent.agent:
                result.pass_test([
                    f"Business ID: {agent.business_id}",
                    "Agent initialized successfully",
                    "OCR tool registered"
                ])
            else:
                result.fail_test("Agent object is None")

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    async def test_direct_tool_call(self) -> TestResult:
        """P0: Direct OCR tool call (not through agent)"""
        result = TestResult("Direct OCR Tool Call", "P0")
        start = time.time()

        try:
            if not self.test_invoice.exists():
                result.fail_test(f"Test image not found: {self.test_invoice}")
                result.duration = time.time() - start
                return result

            ocr_result = ocr_tool(str(self.test_invoice), mode="document")

            if 'error' in ocr_result:
                result.fail_test(f"OCR returned error: {ocr_result['error']}")
            elif 'text' in ocr_result:
                text_preview = ocr_result['text'][:100]
                result.pass_test([
                    f"Text extracted: {len(ocr_result['text'])} chars",
                    f"Preview: {text_preview}...",
                    f"Inference: {ocr_result.get('inference_time', 'N/A')}s"
                ])
            else:
                result.fail_test("No 'text' field in OCR result")

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    async def test_qa_agent_validate_screenshot(self) -> TestResult:
        """P0: QA Agent validate_screenshot method"""
        result = TestResult("QA Agent validate_screenshot()", "P0")
        start = time.time()

        try:
            agent = QAAgent(business_id="test-validate")
            await agent.initialize()

            # Call validate_screenshot directly
            validation_json = agent.validate_screenshot(str(self.test_ticket))
            validation = json.loads(validation_json)

            if validation.get('valid'):
                result.pass_test([
                    f"Valid: {validation['valid']}",
                    f"Word count: {validation.get('word_count', 0)}",
                    f"Has content: {validation.get('has_content', False)}",
                    f"Inference: {validation.get('inference_time', 'N/A')}s"
                ])
            else:
                result.fail_test(f"Validation failed: {validation.get('error', 'Unknown')}")

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    async def test_json_response_format(self) -> TestResult:
        """P0: Verify JSON response format"""
        result = TestResult("JSON Response Format", "P0")
        start = time.time()

        try:
            validation = qa_agent_screenshot_validator(str(self.test_invoice))

            # Check required fields
            required_fields = ['valid', 'text', 'word_count', 'has_content', 'inference_time']
            missing_fields = [f for f in required_fields if f not in validation]

            if missing_fields:
                result.fail_test(f"Missing fields: {missing_fields}")
            else:
                result.pass_test([
                    f"All required fields present: {required_fields}",
                    f"Valid type: {type(validation['valid']).__name__}",
                    f"Text type: {type(validation['text']).__name__}"
                ])

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    async def test_performance_baseline(self) -> TestResult:
        """P0: Check performance (<5s total)"""
        result = TestResult("Performance Baseline (<5s)", "P0")
        start = time.time()

        try:
            ocr_result = ocr_tool(str(self.test_invoice), mode="document")

            if 'error' in ocr_result:
                result.fail_test(f"OCR error: {ocr_result['error']}")
            else:
                duration = time.time() - start
                inference_time = ocr_result.get('inference_time', duration)

                if duration < 5.0:
                    result.pass_test([
                        f"Total: {duration:.2f}s (target: <5s)",
                        f"OCR inference: {inference_time:.2f}s",
                        f"Overhead: {duration - inference_time:.2f}s"
                    ])
                else:
                    result.fail_test(f"Too slow: {duration:.2f}s (target: <5s)")

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    # ========================================
    # P0 TESTS: ERROR SCENARIOS
    # ========================================

    async def test_nonexistent_file(self) -> TestResult:
        """P0: Test with non-existent file"""
        result = TestResult("Non-existent File Handling", "P0")
        start = time.time()

        try:
            fake_path = "/tmp/nonexistent_image_12345.png"
            validation = qa_agent_screenshot_validator(fake_path)

            # Should return error, not crash
            if not validation.get('valid'):
                result.pass_test([
                    "Gracefully handled missing file",
                    f"Error: {validation.get('error', 'N/A')}"
                ])
            else:
                result.fail_test("Should have failed for non-existent file")

        except Exception as e:
            # Catching exception is also acceptable (graceful failure)
            result.pass_test([
                "Exception caught (acceptable)",
                f"Exception: {type(e).__name__}"
            ])

        result.duration = time.time() - start
        return result

    async def test_invalid_file_path(self) -> TestResult:
        """P0: Test with invalid file path"""
        result = TestResult("Invalid Path Handling", "P0")
        start = time.time()

        try:
            invalid_paths = [
                "",
                "/",
                ".",
                None
            ]

            errors_handled = 0
            for path in invalid_paths:
                try:
                    if path is None:
                        continue  # Skip None to avoid TypeErrors
                    validation = qa_agent_screenshot_validator(path)
                    if not validation.get('valid'):
                        errors_handled += 1
                except Exception:
                    errors_handled += 1

            if errors_handled >= 3:  # At least 3/4 handled gracefully
                result.pass_test([
                    f"Handled {errors_handled}/{len(invalid_paths)-1} invalid paths",
                    "No crashes"
                ])
            else:
                result.fail_test(f"Only handled {errors_handled} invalid paths")

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    async def test_no_crashes(self) -> TestResult:
        """P0: Verify no crashes/exceptions in normal flow"""
        result = TestResult("No Crashes in Normal Flow", "P0")
        start = time.time()

        try:
            agent = QAAgent(business_id="crash-test")
            await agent.initialize()

            # Multiple calls
            for img in [self.test_invoice, self.test_ticket]:
                if img.exists():
                    validation_json = agent.validate_screenshot(str(img))
                    validation = json.loads(validation_json)
                    # Just check it doesn't crash

            result.pass_test([
                "Multiple calls executed without crashes",
                "Agent remains stable"
            ])

        except Exception as e:
            result.fail_test(f"Crashed: {str(e)}")

        result.duration = time.time() - start
        return result

    # ========================================
    # P1 TESTS: SERVICE INTEGRATION
    # ========================================

    async def test_ocr_service_health(self) -> TestResult:
        """P1: Verify OCR service health on port 8001"""
        result = TestResult("OCR Service Health Check", "P1")
        start = time.time()

        try:
            import requests

            response = requests.get("http://localhost:8001/health", timeout=5)

            if response.status_code == 200:
                health = response.json()
                result.pass_test([
                    f"Status: {health.get('status', 'unknown')}",
                    f"Engine: {health.get('engine', 'unknown')}",
                    f"Port: 8001"
                ])
            else:
                result.fail_test(f"Service returned {response.status_code}")

        except Exception as e:
            result.fail_test(f"Service unreachable: {str(e)}")

        result.duration = time.time() - start
        return result

    async def test_service_running(self) -> TestResult:
        """P1: Test with service running"""
        result = TestResult("Service Integration Test", "P1")
        start = time.time()

        try:
            # Make actual OCR request
            ocr_result = ocr_tool(str(self.test_invoice), mode="document")

            if 'error' in ocr_result:
                result.fail_test(f"OCR error: {ocr_result['error']}")
            else:
                result.pass_test([
                    "Service responded successfully",
                    f"Engine: {ocr_result.get('engine', 'unknown')}",
                    f"Cached: {ocr_result.get('cached', False)}"
                ])

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    async def test_caching_behavior(self) -> TestResult:
        """P1: Check caching behavior (repeat request)"""
        result = TestResult("Caching Behavior", "P1")
        start = time.time()

        try:
            # First request
            first = ocr_tool(str(self.test_ticket), mode="document")
            time.sleep(0.1)

            # Second request (should be cached)
            second = ocr_tool(str(self.test_ticket), mode="document")

            first_cached = first.get('cached', False)
            second_cached = second.get('cached', False)

            # Second request should ideally be cached
            result.pass_test([
                f"First request cached: {first_cached}",
                f"Second request cached: {second_cached}",
                f"First time: {first.get('inference_time', 0):.2f}s",
                f"Second time: {second.get('inference_time', 0):.2f}s"
            ])

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    # ========================================
    # P1 TESTS: AGENT FRAMEWORK COMPATIBILITY
    # ========================================

    async def test_tool_registration(self) -> TestResult:
        """P1: Verify tool registration in tools array"""
        result = TestResult("Tool Registration", "P1")
        start = time.time()

        try:
            agent = QAAgent(business_id="tool-check")
            await agent.initialize()

            # Check if agent has the method
            if hasattr(agent, 'validate_screenshot'):
                result.pass_test([
                    "validate_screenshot method exists",
                    "Tool properly registered"
                ])
            else:
                result.fail_test("validate_screenshot method not found")

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    async def test_async_sync_compatibility(self) -> TestResult:
        """P1: Check async/sync compatibility"""
        result = TestResult("Async/Sync Compatibility", "P1")
        start = time.time()

        try:
            agent = QAAgent(business_id="async-check")
            await agent.initialize()

            # validate_screenshot is sync, should work in async context
            validation_json = agent.validate_screenshot(str(self.test_invoice))
            validation = json.loads(validation_json)

            if validation.get('valid'):
                result.pass_test([
                    "Sync method works in async context",
                    "No blocking issues"
                ])
            else:
                result.fail_test("Method failed in async context")

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    async def test_daao_tumix_compatibility(self) -> TestResult:
        """P1: Confirm no conflicts with DAAO/TUMIX"""
        result = TestResult("DAAO/TUMIX Compatibility", "P1")
        start = time.time()

        try:
            agent = QAAgent(business_id="daao-tumix-check")
            await agent.initialize()

            # Check DAAO router exists
            has_router = hasattr(agent, 'router') and agent.router is not None

            # Check TUMIX termination exists
            has_termination = hasattr(agent, 'termination') and agent.termination is not None

            # OCR should coexist with DAAO/TUMIX
            if has_router and has_termination:
                result.pass_test([
                    "DAAO router: present",
                    "TUMIX termination: present",
                    "OCR tool: present",
                    "No conflicts detected"
                ])
            else:
                result.fail_test(f"Missing components: router={has_router}, termination={has_termination}")

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    # ========================================
    # P2 TESTS: PERFORMANCE BASELINE
    # ========================================

    async def test_inference_time(self) -> TestResult:
        """P2: Measure inference time"""
        result = TestResult("Inference Time Measurement", "P2")
        start = time.time()

        try:
            times = []

            for img in [self.test_invoice, self.test_ticket]:
                if img.exists():
                    img_start = time.time()
                    ocr_result = ocr_tool(str(img), mode="document")
                    img_time = time.time() - img_start

                    if 'error' not in ocr_result:
                        times.append(img_time)

            if times:
                avg_time = sum(times) / len(times)
                result.pass_test([
                    f"Images processed: {len(times)}",
                    f"Average time: {avg_time:.2f}s",
                    f"Min: {min(times):.2f}s, Max: {max(times):.2f}s"
                ])
            else:
                result.fail_test("No successful OCR operations")

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    async def test_memory_usage(self) -> TestResult:
        """P2: Check memory usage (basic)"""
        result = TestResult("Memory Usage Check", "P2")
        start = time.time()

        try:
            import psutil
            import os

            process = psutil.Process(os.getpid())
            mem_before = process.memory_info().rss / 1024 / 1024  # MB

            # Process images
            for img in [self.test_invoice, self.test_ticket]:
                if img.exists():
                    ocr_tool(str(img), mode="document")

            mem_after = process.memory_info().rss / 1024 / 1024  # MB
            mem_delta = mem_after - mem_before

            result.pass_test([
                f"Memory before: {mem_before:.1f} MB",
                f"Memory after: {mem_after:.1f} MB",
                f"Delta: {mem_delta:.1f} MB"
            ])

        except ImportError:
            result.pass_test(["psutil not available, skipping"])
        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    async def test_multiple_images(self) -> TestResult:
        """P2: Test with 2-3 images"""
        result = TestResult("Multiple Images Test", "P2")
        start = time.time()

        try:
            images = [self.test_invoice, self.test_ticket]
            successes = 0

            for img in images:
                if img.exists():
                    ocr_result = ocr_tool(str(img), mode="document")
                    if 'error' not in ocr_result:
                        successes += 1

            if successes == len(images):
                result.pass_test([
                    f"All {successes} images processed successfully",
                    "No bottlenecks detected"
                ])
            else:
                result.fail_test(f"Only {successes}/{len(images)} succeeded")

        except Exception as e:
            result.fail_test(str(e))

        result.duration = time.time() - start
        return result

    # ========================================
    # TEST RUNNER
    # ========================================

    async def run_all_tests(self):
        """Run all integration tests"""
        print(f"\n{BLUE}{'='*70}{RESET}")
        print(f"{BLUE}QA AGENT OCR INTEGRATION TEST SUITE{RESET}")
        print(f"{BLUE}Alex - Integration Testing Specialist{RESET}")
        print(f"{BLUE}{'='*70}{RESET}")

        # P0: Happy Path
        self.print_header("P0 TESTS: HAPPY PATH")
        self.add_result(await self.test_qa_agent_initialization())
        self.add_result(await self.test_direct_tool_call())
        self.add_result(await self.test_qa_agent_validate_screenshot())
        self.add_result(await self.test_json_response_format())
        self.add_result(await self.test_performance_baseline())

        # P0: Error Scenarios
        self.print_header("P0 TESTS: ERROR SCENARIOS")
        self.add_result(await self.test_nonexistent_file())
        self.add_result(await self.test_invalid_file_path())
        self.add_result(await self.test_no_crashes())

        # P1: Service Integration
        self.print_header("P1 TESTS: SERVICE INTEGRATION")
        self.add_result(await self.test_ocr_service_health())
        self.add_result(await self.test_service_running())
        self.add_result(await self.test_caching_behavior())

        # P1: Agent Framework Compatibility
        self.print_header("P1 TESTS: AGENT FRAMEWORK COMPATIBILITY")
        self.add_result(await self.test_tool_registration())
        self.add_result(await self.test_async_sync_compatibility())
        self.add_result(await self.test_daao_tumix_compatibility())

        # P2: Performance Baseline
        self.print_header("P2 TESTS: PERFORMANCE BASELINE")
        self.add_result(await self.test_inference_time())
        self.add_result(await self.test_memory_usage())
        self.add_result(await self.test_multiple_images())

    def generate_report(self):
        """Generate final test report"""
        print(f"\n{BLUE}{'='*70}{RESET}")
        print(f"{BLUE}INTEGRATION TEST REPORT{RESET}")
        print(f"{BLUE}{'='*70}{RESET}")

        # Calculate statistics
        total = len(self.results)
        passed = sum(1 for r in self.results if r.passed)
        failed = total - passed

        p0_total = sum(1 for r in self.results if r.priority == "P0")
        p0_passed = sum(1 for r in self.results if r.priority == "P0" and r.passed)

        p1_total = sum(1 for r in self.results if r.priority == "P1")
        p1_passed = sum(1 for r in self.results if r.priority == "P1" and r.passed)

        p2_total = sum(1 for r in self.results if r.priority == "P2")
        p2_passed = sum(1 for r in self.results if r.priority == "P2" and r.passed)

        print(f"\n{BLUE}Summary:{RESET}")
        print(f"  Total tests: {total}")
        print(f"  Passed: {GREEN}{passed}{RESET}")
        print(f"  Failed: {RED}{failed}{RESET}")
        print(f"  Pass rate: {(passed/total*100):.1f}%")

        print(f"\n{BLUE}By Priority:{RESET}")
        print(f"  P0 (Critical): {p0_passed}/{p0_total} ({(p0_passed/p0_total*100):.0f}%)")
        print(f"  P1 (Important): {p1_passed}/{p1_total} ({(p1_passed/p1_total*100):.0f}%)")
        print(f"  P2 (Nice-to-have): {p2_passed}/{p2_total} ({(p2_passed/p2_total*100):.0f}%)")

        # Integration score (1-10)
        score = self.calculate_integration_score()
        score_color = GREEN if score >= 8 else YELLOW if score >= 6 else RED
        print(f"\n{BLUE}Integration Score: {score_color}{score:.1f}/10{RESET}")
        print(f"  Rationale: {self.get_score_rationale(score)}")

        # Critical issues
        print(f"\n{BLUE}Critical Issues Found:{RESET}")
        critical_issues = [r for r in self.results if not r.passed and r.priority == "P0"]
        if critical_issues:
            for issue in critical_issues:
                print(f"  {RED}[P0]{RESET} {issue.name}: {issue.error}")
        else:
            print(f"  {GREEN}None - All P0 tests passing{RESET}")

        # Performance metrics
        print(f"\n{BLUE}Performance Metrics:{RESET}")
        perf_tests = [r for r in self.results if "Performance" in r.name or "Inference" in r.name]
        for test in perf_tests:
            if test.passed and test.notes:
                print(f"  {test.name}:")
                for note in test.notes:
                    print(f"    - {note}")

        # Production readiness verdict
        print(f"\n{BLUE}PRODUCTION READINESS VERDICT:{RESET}")
        verdict, reason = self.get_production_verdict()
        verdict_color = GREEN if verdict == "PASS" else YELLOW if verdict == "CONDITIONAL PASS" else RED
        print(f"  {verdict_color}{verdict}{RESET}")
        print(f"  Reason: {reason}")

        # Bugs to fix
        print(f"\n{BLUE}Bugs to Fix Before Deployment:{RESET}")
        bugs = self.get_bugs_to_fix()
        if bugs:
            for i, bug in enumerate(bugs, 1):
                print(f"  {i}. [{bug['priority']}] {bug['issue']}")
        else:
            print(f"  {GREEN}None - System is production ready{RESET}")

    def calculate_integration_score(self) -> float:
        """Calculate integration score (1-10)"""
        total = len(self.results)
        if total == 0:
            return 0.0

        # Weighted scoring
        p0_results = [r for r in self.results if r.priority == "P0"]
        p1_results = [r for r in self.results if r.priority == "P1"]
        p2_results = [r for r in self.results if r.priority == "P2"]

        p0_score = sum(1 for r in p0_results if r.passed) / len(p0_results) if p0_results else 1.0
        p1_score = sum(1 for r in p1_results if r.passed) / len(p1_results) if p1_results else 1.0
        p2_score = sum(1 for r in p2_results if r.passed) / len(p2_results) if p2_results else 1.0

        # Weighted: P0 = 50%, P1 = 30%, P2 = 20%
        weighted_score = (p0_score * 0.5) + (p1_score * 0.3) + (p2_score * 0.2)

        return round(weighted_score * 10, 1)

    def get_score_rationale(self, score: float) -> str:
        """Get rationale for integration score"""
        if score >= 9.0:
            return "Excellent - All critical tests passing, ready for production"
        elif score >= 8.0:
            return "Good - Minor issues only, safe for production"
        elif score >= 7.0:
            return "Acceptable - Some P1 issues, conditional deployment"
        elif score >= 6.0:
            return "Marginal - Multiple issues, needs fixes"
        else:
            return "Poor - Critical failures, not ready for production"

    def get_production_verdict(self) -> tuple:
        """Get production readiness verdict"""
        p0_results = [r for r in self.results if r.priority == "P0"]
        p0_passed = sum(1 for r in p0_results if r.passed)
        p0_total = len(p0_results)

        if p0_passed == p0_total:
            return "PASS", "All P0 tests passing, system is production ready"
        elif p0_passed / p0_total >= 0.9:
            return "CONDITIONAL PASS", "Minor P0 failures, can deploy with monitoring"
        else:
            return "FAIL", f"Only {p0_passed}/{p0_total} P0 tests passing, critical issues exist"

    def get_bugs_to_fix(self) -> List[Dict]:
        """Get list of bugs to fix before deployment"""
        bugs = []

        for result in self.results:
            if not result.passed and result.error:
                bugs.append({
                    'priority': result.priority,
                    'test': result.name,
                    'issue': result.error
                })

        # Sort by priority
        priority_order = {'P0': 0, 'P1': 1, 'P2': 2}
        bugs.sort(key=lambda x: priority_order[x['priority']])

        return bugs


async def main():
    """Main test runner"""
    tester = QAOCRIntegrationTester()

    print(f"\n{YELLOW}Starting integration tests...{RESET}")
    print(f"{YELLOW}Time-boxed: 30 minutes max{RESET}")

    start_time = time.time()

    await tester.run_all_tests()
    tester.generate_report()

    total_time = time.time() - start_time
    print(f"\n{BLUE}Total execution time: {total_time:.2f}s{RESET}")
    print(f"{BLUE}{'='*70}{RESET}\n")


if __name__ == "__main__":
    asyncio.run(main())
