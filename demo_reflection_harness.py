"""
Reflection Harness Demo
Demonstrates the complete reflection system with real examples.
"""

import asyncio
import sys
sys.path.insert(0, '/home/genesis/genesis-rebuild')

from agents.reflection_agent import get_reflection_agent, QualityDimension
from infrastructure.reflection_harness import (
    ReflectionHarness,
    FallbackBehavior,
    reflect_on
)


async def demo_simple_reflection():
    """Demo 1: Simple reflection on code"""
    print("\n" + "="*70)
    print("DEMO 1: Simple Reflection on Code")
    print("="*70 + "\n")

    agent = get_reflection_agent(quality_threshold=0.70)

    # Good code example
    good_code = """
function calculateSum(x: number, y: number): number {
    if (typeof x !== 'number' || typeof y !== 'number') {
        throw new Error('Invalid input: numbers required');
    }
    return x + y;
}
"""

    print("Reflecting on HIGH-QUALITY code...")
    result = await agent.reflect(
        content=good_code,
        content_type="code",
        context={"required_features": ["error handling", "type checking"]}
    )

    print(f"\nResults:")
    print(f"  Overall Score: {result.overall_score:.2f}")
    print(f"  Passes Threshold: {'✅ YES' if result.passes_threshold else '❌ NO'}")
    print(f"  Summary: {result.summary_feedback}")
    print(f"  Reflection Time: {result.reflection_time_seconds:.3f}s")

    print(f"\nDimension Scores:")
    for dim_name, dim_score in result.dimension_scores.items():
        status = "✅" if dim_score.score >= 0.7 else "⚠️"
        print(f"  {status} {dim_name.capitalize()}: {dim_score.score:.0%}")

    # Bad code example
    bad_code = """
function process(data) {
    console.log('Processing:', data);
    eval(data);  // Security issue!
    // TODO: Add validation
    return data.map(x => x).filter(x => x).map(x => x * 2);
}
"""

    print("\n" + "-"*70)
    print("Reflecting on LOW-QUALITY code...")
    result = await agent.reflect(
        content=bad_code,
        content_type="code",
        context={}
    )

    print(f"\nResults:")
    print(f"  Overall Score: {result.overall_score:.2f}")
    print(f"  Passes Threshold: {'✅ YES' if result.passes_threshold else '❌ NO'}")
    print(f"  Critical Issues: {len(result.critical_issues)}")

    if result.critical_issues:
        print(f"\nCritical Issues Found:")
        for i, issue in enumerate(result.critical_issues[:5], 1):
            print(f"  {i}. {issue}")

    print(f"\nSuggestions:")
    for i, suggestion in enumerate(result.suggestions[:5], 1):
        print(f"  {i}. {suggestion}")


async def demo_automatic_regeneration():
    """Demo 2: Automatic regeneration with harness"""
    print("\n" + "="*70)
    print("DEMO 2: Automatic Regeneration")
    print("="*70 + "\n")

    harness = ReflectionHarness(
        max_attempts=3,
        quality_threshold=0.75,
        fallback_behavior=FallbackBehavior.WARN
    )

    attempt_count = 0

    async def generate_code_that_improves():
        """Simulates code generation that improves on retry"""
        nonlocal attempt_count
        attempt_count += 1

        print(f"  Generation Attempt #{attempt_count}")

        if attempt_count == 1:
            # Bad first attempt
            return "eval(x); TODO: implement"
        elif attempt_count == 2:
            # Better second attempt
            return "function process(x) { console.log(x); return x; }"
        else:
            # Good third attempt
            return """
function processData(data: any): any {
    if (!data) {
        throw new Error('Data required');
    }
    return data;
}
"""

    print("Starting generation with automatic regeneration...")
    result = await harness.wrap(
        generate_code_that_improves,
        "code",
        {}
    )

    print(f"\nResults:")
    print(f"  Attempts Made: {result.attempts_made}")
    print(f"  Regenerations: {result.regenerations}")
    print(f"  Passed Reflection: {'✅ YES' if result.passed_reflection else '❌ NO'}")
    print(f"  Fallback Used: {'⚠️ YES' if result.fallback_used else 'NO'}")
    print(f"  Total Time: {result.total_time_seconds:.3f}s")

    if result.reflection_result:
        print(f"  Final Quality Score: {result.reflection_result.overall_score:.2f}")


async def demo_decorator_pattern():
    """Demo 3: Decorator pattern usage"""
    print("\n" + "="*70)
    print("DEMO 3: Decorator Pattern")
    print("="*70 + "\n")

    @reflect_on(content_type="code", quality_threshold=0.70, max_attempts=2)
    async def build_api_endpoint(route_name: str):
        """Generate an API endpoint with automatic reflection"""
        print(f"  Generating API endpoint: {route_name}")
        return f"""
async function {route_name}Handler(req: Request, res: Response) {{
    try {{
        const data = await fetchData();
        res.json({{ success: true, data }});
    }} catch (error) {{
        res.status(500).json({{
            success: false,
            error: error.message
        }});
    }}
}}
"""

    print("Using decorator for automatic reflection...")
    result = await build_api_endpoint("users")

    print(f"\nResults:")
    print(f"  Generated: usersHandler function")
    print(f"  Quality Score: {result.reflection_result.overall_score:.2f}")
    print(f"  Passed: {'✅' if result.passed_reflection else '❌'}")


async def demo_statistics_tracking():
    """Demo 4: Statistics tracking"""
    print("\n" + "="*70)
    print("DEMO 4: Statistics Tracking")
    print("="*70 + "\n")

    agent = get_reflection_agent()
    harness = ReflectionHarness(quality_threshold=0.70)

    print("Performing 5 reflections...")

    # Perform multiple reflections
    test_codes = [
        "function a() { return 1; }",
        "const b = () => 2;",
        "class C { getValue() { return 3; } }",
        "export function d() { return 4; }",
        "async function e() { return 5; }"
    ]

    for i, code in enumerate(test_codes, 1):
        print(f"  Reflection {i}/5...")
        await harness.wrap(
            lambda c=code: async_return(c),
            "code",
            {}
        )

    # Get agent statistics
    agent_stats = agent.get_statistics()
    print(f"\nAgent Statistics:")
    print(f"  Total Reflections: {agent_stats['total_reflections']}")
    print(f"  Total Passes: {agent_stats['total_passes']}")
    print(f"  Total Failures: {agent_stats['total_failures']}")
    print(f"  Success Rate: {agent_stats['success_rate']:.0%}")

    # Get harness statistics
    harness_stats = harness.get_statistics()
    print(f"\nHarness Statistics:")
    print(f"  Total Invocations: {harness_stats['total_invocations']}")
    print(f"  First Attempt Success: {harness_stats['total_passes_first_attempt']}")
    print(f"  After Regeneration: {harness_stats['total_passes_after_regen']}")
    print(f"  Average Attempts: {harness_stats['average_attempts']:.2f}")
    print(f"  Overall Success Rate: {harness_stats['success_rate']:.0%}")


async def async_return(value):
    """Helper for async lambda"""
    return value


async def demo_quality_dimensions():
    """Demo 5: Quality dimensions breakdown"""
    print("\n" + "="*70)
    print("DEMO 5: Quality Dimensions Breakdown")
    print("="*70 + "\n")

    agent = get_reflection_agent()

    code = """
function authenticateUser(username, password) {
    // TODO: Add input validation
    console.log('Authenticating:', username);
    const query = 'SELECT * FROM users WHERE username = ?';
    eval(password);  // BAD!
    return true;
}
"""

    print("Analyzing code across all 6 quality dimensions...")
    result = await agent.reflect(content=code, content_type="code", context={})

    print(f"\nOverall Score: {result.overall_score:.0%}\n")

    # Show each dimension with details
    for dimension in QualityDimension:
        dim_score = result.dimension_scores[dimension.value]
        status = "✅" if dim_score.score >= 0.7 else "⚠️"

        print(f"{status} {dimension.value.upper()}: {dim_score.score:.0%}")
        print(f"   Feedback: {dim_score.feedback}")

        if dim_score.issues:
            print(f"   Issues:")
            for issue in dim_score.issues[:2]:
                print(f"     - {issue}")

        if dim_score.suggestions:
            print(f"   Suggestions:")
            for suggestion in dim_score.suggestions[:2]:
                print(f"     - {suggestion}")

        print()


async def main():
    """Run all demos"""
    print("\n")
    print("╔" + "="*68 + "╗")
    print("║" + " "*15 + "REFLECTION HARNESS DEMO" + " "*30 + "║")
    print("║" + " "*10 + "Production-Ready Quality Assurance System" + " "*16 + "║")
    print("╚" + "="*68 + "╝")

    try:
        await demo_simple_reflection()
        await demo_automatic_regeneration()
        await demo_decorator_pattern()
        await demo_statistics_tracking()
        await demo_quality_dimensions()

        print("\n" + "="*70)
        print("✅ ALL DEMOS COMPLETED SUCCESSFULLY")
        print("="*70 + "\n")

    except Exception as e:
        print(f"\n❌ Error during demo: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
