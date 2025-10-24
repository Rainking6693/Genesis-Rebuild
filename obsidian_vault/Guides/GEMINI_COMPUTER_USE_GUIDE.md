---
title: Gemini Computer Use - Complete Guide
category: Guides
dg-publish: true
publish: true
tags:
- types
- Part
source: docs/GEMINI_COMPUTER_USE_GUIDE.md
exported: '2025-10-24T22:05:26.926914'
---

# Gemini Computer Use - Complete Guide

**Source:** Gemini Computer Use API Documentation
**Date Added:** October 15, 2025
**Status:** Production-ready Preview Model

---

## Overview

The Gemini 2.5 Computer Use Preview model and tool enable building browser control agents that interact with and automate tasks. Using screenshots, the Computer Use model can "see" a computer screen and "act" by generating specific UI actions like mouse clicks and keyboard inputs.

**Model:** `gemini-2.5-computer-use-preview-10-2025`

### Use Cases
- Automate repetitive data entry or form filling on websites
- Perform automated testing of web applications and user flows
- Conduct research across various websites (e.g., gathering product information, prices, reviews)

### Important Notes
- **Preview model** - May be prone to errors and security vulnerabilities
- **Supervision required** for important tasks
- **Avoid** using for critical decisions, sensitive data, or irreversible actions
- Review Safety best practices and Prohibited Use Policy

---

## How Computer Use Works

### Agent Loop Architecture

1. **Send a request to the model**
   - Add Computer Use tool to API request
   - Optionally add custom user-defined functions or excluded functions
   - Prompt the model with user's request

2. **Receive the model response**
   - Model analyzes user request and screenshot
   - Generates `function_call` representing UI action (e.g., "click at coordinate (x,y)" or "type 'text'")
   - May include `safety_decision` from internal safety system:
     - `Regular / allowed`: Action is safe to execute
     - `Requires confirmation`: Action may be risky (e.g., clicking cookie banner)

3. **Execute the received action**
   - Client-side code receives `function_call` and `safety_decision`
   - If allowed: Execute the action in target environment
   - If requires confirmation: Prompt end-user before executing
   - If denied: Don't execute, provide feedback to model

4. **Capture the new environment state**
   - If executed: Capture new screenshot and current URL
   - Send back to model as `function_response`
   - Loop repeats until task complete, error occurs, or terminated

---

## Implementation Guide

### Prerequisites

1. **Secure execution environment** - Sandboxed VM, container, or dedicated browser profile with limited permissions
2. **Client-side action handler** - Logic to execute actions and capture screenshots (e.g., Playwright)

### Installation (Python + Playwright)

```bash
pip install google-genai playwright
playwright install
```

### Step 1: Send Request to Model

```python
from google import genai
from google.genai import types
from google.genai.types import Content, Part

client = genai.Client()

# Specify predefined functions to exclude (optional)
excluded_functions = ["drag_and_drop"]

generate_content_config = genai.types.GenerateContentConfig(
    tools=[
        # 1. Computer Use tool with browser environment
        types.Tool(
            computer_use=types.ComputerUse(
                environment=types.Environment.ENVIRONMENT_BROWSER,
                # Optional: Exclude specific predefined functions
                excluded_predefined_functions=excluded_functions
            )
        ),
        # 2. Optional: Custom user-defined functions
        #types.Tool(
        #    function_declarations=custom_functions
        #)
    ],
)

# Create the content with user message
contents=[
    Content(
        role="user",
        parts=[
            Part(text="Search for highly rated smart fridges with touchscreen, 2 doors, around 25 cu ft, priced below 4000 dollars on Google Shopping. Create a bulleted list of the 3 cheapest options in the format of name, description, price in an easy-to-read layout."),
            # Optional: include a screenshot of the initial state
            #Part.from_bytes(
            #    data=screenshot_image_bytes,
            #    mime_type='image/png',
            #),
        ],
    )
]

# Generate content with the configured settings
response = client.models.generate_content(
    model='gemini-2.5-computer-use-preview-10-2025',
    contents=contents,
    config=generate_content_config,
)

print(response)
```

### Step 2: Receive Model Response

Example response:

```json
{
  "content": {
    "parts": [
      {
        "text": "I will type the search query into the search bar. The search bar is in the center of the page."
      },
      {
        "function_call": {
          "name": "type_text_at",
          "args": {
            "x": 371,
            "y": 470,
            "text": "highly rated smart fridges with touchscreen, 2 doors, around 25 cu ft, priced below 4000 dollars on Google Shopping",
            "press_enter": true
          }
        }
      }
    ]
  }
}
```

### Step 3: Execute Received Actions

```python
from typing import Any, List, Tuple
import time

def denormalize_x(x: int, screen_width: int) -> int:
    """Convert normalized x coordinate (0-1000) to actual pixel coordinate."""
    return int(x / 1000 * screen_width)

def denormalize_y(y: int, screen_height: int) -> int:
    """Convert normalized y coordinate (0-1000) to actual pixel coordinate."""
    return int(y / 1000 * screen_height)

def execute_function_calls(candidate, page, screen_width, screen_height):
    results = []
    function_calls = []
    for part in candidate.content.parts:
        if part.function_call:
            function_calls.append(part.function_call)

    for function_call in function_calls:
        action_result = {}
        fname = function_call.name
        args = function_call.args
        print(f"  -> Executing: {fname}")

        try:
            if fname == "open_web_browser":
                pass # Already open
            elif fname == "click_at":
                actual_x = denormalize_x(args["x"], screen_width)
                actual_y = denormalize_y(args["y"], screen_height)
                page.mouse.click(actual_x, actual_y)
            elif fname == "type_text_at":
                actual_x = denormalize_x(args["x"], screen_width)
                actual_y = denormalize_y(args["y"], screen_height)
                text = args["text"]
                press_enter = args.get("press_enter", False)

                page.mouse.click(actual_x, actual_y)
                # Simple clear (Command+A, Backspace for Mac)
                page.keyboard.press("Meta+A")
                page.keyboard.press("Backspace")
                page.keyboard.type(text)
                if press_enter:
                    page.keyboard.press("Enter")
            else:
                print(f"Warning: Unimplemented or custom function {fname}")

            # Wait for potential navigations/renders
            page.wait_for_load_state(timeout=5000)
            time.sleep(1)

        except Exception as e:
            print(f"Error executing {fname}: {e}")
            action_result = {"error": str(e)}

        results.append((fname, action_result))

    return results
```

**Recommended screen size:** (1440, 900)

**Note:** Model outputs normalized coordinates (0-999) regardless of input image dimensions. Must convert back to actual pixel values.

### Step 4: Capture New Environment State

```python
def get_function_responses(page, results):
    screenshot_bytes = page.screenshot(type="png")
    current_url = page.url
    function_responses = []
    for name, result in results:
        response_data = {"url": current_url}
        response_data.update(result)
        function_responses.append(
            types.FunctionResponse(
                name=name,
                response=response_data,
                parts=[types.FunctionResponsePart(
                    inline_data=types.FunctionResponseBlob(
                        mime_type="image/png",
                        data=screenshot_bytes))
                ]
            )
        )
    return function_responses
```

---

## Complete Agent Loop Example

```python
import time
from typing import Any, List, Tuple
from playwright.sync_api import sync_playwright

from google import genai
from google.genai import types
from google.genai.types import Content, Part

client = genai.Client()

# Constants for screen dimensions
SCREEN_WIDTH = 1440
SCREEN_HEIGHT = 900

# Setup Playwright
print("Initializing browser...")
playwright = sync_playwright().start()
browser = playwright.chromium.launch(headless=False)
context = browser.new_context(viewport={"width": SCREEN_WIDTH, "height": SCREEN_HEIGHT})
page = context.new_page()

try:
    # Go to initial page
    page.goto("https://ai.google.dev/gemini-api/docs")

    # Configure the model
    config = types.GenerateContentConfig(
        tools=[types.Tool(computer_use=types.ComputerUse(
            environment=types.Environment.ENVIRONMENT_BROWSER
        ))],
        thinking_config=types.ThinkingConfig(include_thoughts=True),
    )

    # Initialize history
    initial_screenshot = page.screenshot(type="png")
    USER_PROMPT = "Go to ai.google.dev/gemini-api/docs and search for pricing."
    print(f"Goal: {USER_PROMPT}")

    contents = [
        Content(role="user", parts=[
            Part(text=USER_PROMPT),
            Part.from_bytes(data=initial_screenshot, mime_type='image/png')
        ])
    ]

    # Agent Loop
    turn_limit = 5
    for i in range(turn_limit):
        print(f"\n--- Turn {i+1} ---")
        print("Thinking...")
        response = client.models.generate_content(
            model='gemini-2.5-computer-use-preview-10-2025',
            contents=contents,
            config=config,
        )

        candidate = response.candidates[0]
        contents.append(candidate.content)

        has_function_calls = any(part.function_call for part in candidate.content.parts)
        if not has_function_calls:
            text_response = " ".join([part.text for part in candidate.content.parts if part.text])
            print("Agent finished:", text_response)
            break

        print("Executing actions...")
        results = execute_function_calls(candidate, page, SCREEN_WIDTH, SCREEN_HEIGHT)

        print("Capturing state...")
        function_responses = get_function_responses(page, results)

        contents.append(
            Content(role="user", parts=[Part(function_response=fr) for fr in function_responses])
        )

finally:
    # Cleanup
    print("\nClosing browser...")
    browser.close()
    playwright.stop()
```

---

## Supported UI Actions

The Computer Use model can request the following actions. **Your client-side code must implement execution logic for these actions.**

| Command Name | Description | Arguments | Example |
|--------------|-------------|-----------|---------|
| `open_web_browser` | Opens the web browser | None | `{"name": "open_web_browser", "args": {}}` |
| `wait_5_seconds` | Pauses execution for 5 seconds | None | `{"name": "wait_5_seconds", "args": {}}` |
| `go_back` | Navigate to previous page | None | `{"name": "go_back", "args": {}}` |
| `go_forward` | Navigate to next page | None | `{"name": "go_forward", "args": {}}` |
| `search` | Navigate to default search engine | None | `{"name": "search", "args": {}}` |
| `navigate` | Navigate directly to URL | `url: str` | `{"name": "navigate", "args": {"url": "https://www.wikipedia.org"}}` |
| `click_at` | Click at specific coordinate (0-999 grid) | `x: int`, `y: int` | `{"name": "click_at", "args": {"y": 300, "x": 500}}` |
| `hover_at` | Hover at specific coordinate | `x: int`, `y: int` | `{"name": "hover_at", "args": {"y": 150, "x": 250}}` |
| `type_text_at` | Type text at coordinate | `x: int`, `y: int`, `text: str`, `press_enter: bool` (optional, default True), `clear_before_typing: bool` (optional, default True) | `{"name": "type_text_at", "args": {"y": 250, "x": 400, "text": "search query", "press_enter": false}}` |
| `key_combination` | Press keyboard keys/combinations | `keys: str` (e.g., 'enter', 'control+c') | `{"name": "key_combination", "args": {"keys": "Control+A"}}` |
| `scroll_document` | Scroll entire webpage | `direction: str` ("up", "down", "left", "right") | `{"name": "scroll_document", "args": {"direction": "down"}}` |
| `scroll_at` | Scroll specific element at coordinate | `x: int`, `y: int`, `direction: str`, `magnitude: int` (optional, default 800) | `{"name": "scroll_at", "args": {"y": 500, "x": 500, "direction": "down", "magnitude": 400}}` |
| `drag_and_drop` | Drag from start to destination | `x: int`, `y: int`, `destination_x: int`, `destination_y: int` | `{"name": "drag_and_drop", "args": {"y": 100, "x": 100, "destination_y": 500, "destination_x": 500}}` |

---

## Custom User-Defined Functions

You can extend functionality by adding custom functions alongside Computer Use tool.

### Example: Android Environment

```python
from typing import Optional, Dict, Any
from google import genai
from google.genai import types

client = genai.Client()

SYSTEM_PROMPT = """You are operating an Android phone. Today's date is October 15, 2023, so ignore any other date provided.
* To provide an answer to the user, *do not use any tools* and output your answer on a separate line. IMPORTANT: Do not add any formatting or additional punctuation/text, just output the answer by itself after two empty lines.
* Make sure you scroll down to see everything before deciding something isn't available.
* You can open an app from anywhere. The icon doesn't have to currently be on screen.
* Unless explicitly told otherwise, make sure to save any changes you make.
* If text is cut off or incomplete, scroll or click into the element to get the full text before providing an answer.
* IMPORTANT: Complete the given task EXACTLY as stated. DO NOT make any assumptions that completing a similar task is correct.  If you can't find what you're looking for, SCROLL to find it.
* If you want to edit some text, ONLY USE THE `type` tool. Do not use the onscreen keyboard.
* Quick settings shouldn't be used to change settings. Use the Settings app instead.
* The given task may already be completed. If so, there is no need to do anything.
"""

def open_app(app_name: str, intent: Optional[str] = None) -> Dict[str, Any]:
    """Opens an app by name.

    Args:
        app_name: Name of the app to open (any string).
        intent: Optional deep-link or action to pass when launching, if the app supports it.

    Returns:
        JSON payload acknowledging the request (app name and optional intent).
    """
    return {"status": "requested_open", "app_name": app_name, "intent": intent}

def long_press_at(x: int, y: int) -> Dict[str, int]:
    """Long-press at a specific screen coordinate.

    Args:
        x: X coordinate (absolute), scaled to the device screen width (pixels).
        y: Y coordinate (absolute), scaled to the device screen height (pixels).

    Returns:
        Object with the coordinates pressed and the duration used.
    """
    return {"x": x, "y": y}

def go_home() -> Dict[str, str]:
    """Navigates to the device home screen.

    Returns:
        A small acknowledgment payload.
    """
    return {"status": "home_requested"}

# Build function declarations
CUSTOM_FUNCTION_DECLARATIONS = [
    types.FunctionDeclaration.from_callable(client=client, callable=open_app),
    types.FunctionDeclaration.from_callable(client=client, callable=long_press_at),
    types.FunctionDeclaration.from_callable(client=client, callable=go_home),
]

# Exclude browser functions
EXCLUDED_PREDEFINED_FUNCTIONS = [
    "open_web_browser",
    "search",
    "navigate",
    "hover_at",
    "scroll_document",
    "go_forward",
    "key_combination",
    "drag_and_drop",
]

# Utility function to construct a GenerateContentConfig
def make_generate_content_config() -> genai.types.GenerateContentConfig:
    """Return a fixed GenerateContentConfig with Computer Use + custom functions."""
    return genai.types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        tools=[
            types.Tool(
                computer_use=types.ComputerUse(
                    environment=types.Environment.ENVIRONMENT_BROWSER,
                    excluded_predefined_functions=EXCLUDED_PREDEFINED_FUNCTIONS,
                )
            ),
            types.Tool(function_declarations=CUSTOM_FUNCTION_DECLARATIONS),
        ],
    )

# Use in request
contents = [
    Content(
        role="user",
        parts=[
            Part(text="Open Chrome, then long-press at 200,400."),
            Part.from_bytes(
                data=screenshot_image_bytes,
                mime_type="image/png",
            ),
        ],
    )
]

config = make_generate_content_config()

response = client.models.generate_content(
    model='gemini-2.5-computer-use-preview-10-2025',
    contents=contents,
    config=config,
)
```

---

## Safety and Security

### Acknowledge Safety Decision

Model may include `safety_decision` in response:

```json
{
  "content": {
    "parts": [
      {
        "text": "I have evaluated step 2. It seems Google detected unusual traffic and is asking me to verify I'm not a robot. I need to click the 'I'm not a robot' checkbox located near the top left (y=98, x=95)."
      },
      {
        "function_call": {
          "name": "click_at",
          "args": {
            "x": 60,
            "y": 100,
            "safety_decision": {
              "explanation": "I have encountered a CAPTCHA challenge that requires interaction. I need you to complete the challenge by clicking the 'I'm not a robot' checkbox and any subsequent verification steps.",
              "decision": "require_confirmation"
            }
          }
        }
      }
    ]
  }
}
```

**If `safety_decision` is `require_confirmation`, you MUST ask end-user to confirm before executing.**

```python
import termcolor

def get_safety_confirmation(safety_decision):
    """Prompt user for confirmation when safety check is triggered."""
    termcolor.cprint("Safety service requires explicit confirmation!", color="red")
    print(safety_decision["explanation"])

    decision = ""
    while decision.lower() not in ("y", "n", "ye", "yes", "no"):
        decision = input("Do you wish to proceed? [Y]es/[N]o\n")

    if decision.lower() in ("n", "no"):
        return "TERMINATE"
    return "CONTINUE"

def execute_function_calls(candidate, page, screen_width, screen_height):
    # ... Extract function calls from response ...

    for function_call in function_calls:
        extra_fr_fields = {}

        # Check for safety decision
        if 'safety_decision' in function_call.args:
            decision = get_safety_confirmation(function_call.args['safety_decision'])
            if decision == "TERMINATE":
                print("Terminating agent loop")
                break
            extra_fr_fields["safety_acknowledgement"] = "true" # Safety acknowledgement

        # ... Execute function call and append to results ...
```

**If user confirms, include safety acknowledgement in FunctionResponse:**

```python
function_response_parts.append(
    FunctionResponse(
        name=name,
        response={"url": current_url,
                  **extra_fr_fields},  # Include safety acknowledgement
        parts=[
            types.FunctionResponsePart(
                inline_data=types.FunctionResponseBlob(
                    mime_type="image/png", data=screenshot
                )
            )
        ]
    )
)
```

### Safety Best Practices

**Risks:**
- **Untrusted content & scams:** Model may rely on untrustworthy sources (e.g., "Free Pixel if you complete survey" scam)
- **Occasional unintended actions:** Model can misinterpret goals or webpage content
- **Policy violations:** Could be directed toward activities violating Google's policies

**Safety Measures:**

1. **Human-in-the-Loop (HITL):**
   - Implement user confirmation when safety response indicates `require_confirmation`
   - Add custom system instructions enforcing your own safety policies
   - Require user confirmation before high-stakes irreversible actions

2. **Secure execution environment:**
   - Run agent in sandboxed VM, container, or dedicated browser profile with limited permissions

3. **Input sanitization:**
   - Sanitize all user-generated text to mitigate prompt injection
   - Helpful security layer, but not a replacement for secure environment

4. **Content guardrails:**
   - Use guardrails and content safety APIs to evaluate:
     - User inputs
     - Tool input/output
     - Agent responses for appropriateness
     - Prompt injection detection
     - Jailbreak detection

5. **Allowlists and blocklists:**
   - Blocklist of prohibited websites (good starting point)
   - Allowlist (more restrictive, more secure)

6. **Observability and logging:**
   - Maintain detailed logs for debugging, auditing, incident response
   - Log: prompts, screenshots, model-suggested actions, safety responses, executed actions

7. **Environment management:**
   - Ensure GUI environment is consistent
   - Unexpected pop-ups/notifications can confuse model
   - Start from known, clean state for each new task

### Example Safety Instructions

```python
SAFETY_SYSTEM_INSTRUCTION = """
SAFETY RULES (ALWAYS FOLLOW):

1. HIGH-STAKES ACTIONS (REQUIRE CONFIRMATION):
   - Any financial transactions or purchases
   - Submitting forms with personal information
   - Deleting files or data
   - Sending emails or messages
   - Changing security settings

   ACTION: Stop and ask user "I'm about to [action]. Should I proceed?"

2. PROHIBITED ACTIONS (NEVER DO):
   - Access banking or payment sites without explicit user permission
   - Bypass security warnings or CAPTCHAs without user confirmation
   - Navigate to suspicious or unverified websites
   - Download files without user approval

3. VERIFICATION REQUIRED:
   - Before clicking "Purchase", "Buy Now", "Confirm Payment" - STOP and confirm
   - Before clicking "Delete", "Remove", "Uninstall" - STOP and confirm
   - Before clicking "Send", "Submit", "Post" on forms - STOP and confirm

4. IF UNCERTAIN:
   - Stop and explain what you're about to do
   - Ask for user guidance
   - Default to being cautious

Remember: It's better to ask twice than act incorrectly once.
"""
```

---

## API Reference Summary

### Primary Endpoints

- **Standard content generation (`generateContent`):** REST endpoint that returns full response in single package
- **Streaming content generation (`streamGenerateContent`):** SSE endpoint that streams response chunks
- **Live API (`BidiGenerateContent`):** WebSocket-based for bi-directional streaming
- **Batch mode (`batchGenerateContent`):** REST endpoint for submitting batches
- **Embeddings (`embedContent`):** REST endpoint for generating text embedding vectors

### Authentication

All requests must include `x-goog-api-key` header with API key:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{...}'
```

### Request Body Structure

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {"text": "..."},
        {"inline_data": {"mime_type": "image/jpeg", "data": "..."}}
      ]
    }
  ]
}
```

### Response Body Structure

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {"text": "..."}
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 1
    }
  ]
}
```

---

## Model Version

**Model Code (Gemini API):** `gemini-2.5-computer-use-preview-10-2025`

---

## Integration with Genesis System

### For Day 4+ Implementation

1. **Wrap Computer Use as Agent Framework Tool:**
   - Create `ComputerUseTool` class in `tools/computer_use_tool.py`
   - Implement all 13 UI actions from Supported Actions list
   - Add to Genesis orchestrator's tool registry

2. **Create Computer Use Agent:**
   - `agents/computer_use_agent.py` - Specialized agent for browser automation
   - Integrates with ReasoningBank to learn successful UI patterns
   - Records trajectories in Replay Buffer for self-improvement

3. **Use Cases for Genesis:**
   - **Market Research Agent:** Automate gathering competitor pricing, features from multiple sites
   - **Testing Agent:** Automated E2E testing of generated web applications
   - **Data Collection Agent:** Scrape product catalogs, pricing data for business analysis
   - **Social Media Agent:** Automate posting, engagement tracking (with strict safety rules)

4. **Safety Integration:**
   - Implement mandatory HITL confirmation for all purchases, deletions, submissions
   - Add Genesis-specific safety instructions to system prompt
   - Log all Computer Use actions to audit trail
   - Run in sandboxed Docker container with limited network access

---

**Document Status:** Ready for Day 4+ implementation
**Last Updated:** October 15, 2025
