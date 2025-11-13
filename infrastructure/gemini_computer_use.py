"""
Gemini 2.5 Computer Use client wired for production.

This module removes the old mock shim and replaces it with a real integration
that uses Google's Gemini 2.5 Computer Use capabilities together with our
Playwright environment.  It adds a safety gate so only whitelisted agents can
invoke computer-use and every action is screened before execution.
"""

from __future__ import annotations

import asyncio
import logging
import os
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Sequence

from google.genai import Client, types
from google.genai.errors import ClientError

from infrastructure.openenv_wrapper import EnvObservation, EnvRegistry, PlaywrightEnv

logger = logging.getLogger(__name__)

DEFAULT_MODEL = os.getenv("GEMINI_COMPUTER_USE_MODEL", "gemini-2.5-pro-exp-0827")
DEFAULT_ALLOWED_ROLES = os.getenv(
    "COMPUTER_USE_ALLOWED_AGENTS",
    "deploy_agent,marketing_agent,seo_agent,content_agent,"
    "genesis_agent,email_agent,growth_agent,communications_agent",
)


class ComputerUseSafetyError(RuntimeError):
    """Raised when an action is blocked by the safety gate."""


@dataclass
class ComputerUseAction:
    """Structured representation of an action emitted by Gemini."""

    name: str
    args: Dict[str, Any]
    raw_call: Optional[types.FunctionCall] = None

    def as_dict(self) -> Dict[str, Any]:
        return {"name": self.name, "args": self.args}


@dataclass
class ComputerUseStep:
    """Record of each executed action for auditing and prompt feedback."""

    action: ComputerUseAction
    result: str
    observation: Dict[str, Any] = field(default_factory=dict)

    def serialize(self) -> Dict[str, Any]:
        return {
            "action": self.action.as_dict(),
            "result": self.result,
            "observation": self.observation,
        }


class ComputerUseSafetyGate:
    """
    Simple but effective safety layer for autonomous computer use.

    * Blocks navigation to disallowed domains
    * Prevents typing secrets or high-risk keywords
    * Requires confirmation for transactional operations
    """

    HIGH_RISK_ACTIONS = {"purchase", "checkout", "transfer_funds", "delete"}
    SENSITIVE_KEYWORDS = {
        "password",
        "secret",
        "token",
        "api_key",
        "credit card",
        "ssn",
    }

    def __init__(
        self,
        agent_role: str,
        require_confirmation: bool = False,
        allowed_domains: Optional[Sequence[str]] = None,
        blocked_domains: Optional[Sequence[str]] = None,
    ):
        self.agent_role = agent_role
        self.require_confirmation = require_confirmation
        self.allowed_domains = {d.strip().lower() for d in allowed_domains or [] if d}
        self.blocked_domains = {d.strip().lower() for d in blocked_domains or [] if d}

    def validate(self, action: ComputerUseAction) -> None:
        name = action.name.lower()

        if name in self.HIGH_RISK_ACTIONS:
            logger.warning(
                "Computer-use attempted high-risk action %s (agent=%s)",
                name,
                self.agent_role,
            )
            raise ComputerUseSafetyError(
                f"High-risk action '{name}' is not permitted for {self.agent_role}."
            )

        if name in {"goto", "navigate", "open_url"}:
            url = (
                action.args.get("url")
                or action.args.get("target")
                or action.args.get("href")
            )
            if not url or not isinstance(url, str):
                raise ComputerUseSafetyError("Navigation action missing URL.")

            url_lower = url.lower()
            if not url_lower.startswith(("http://", "https://")):
                raise ComputerUseSafetyError("Navigation blocked: URL must be http(s).")

            if self.allowed_domains:
                if not any(domain in url_lower for domain in self.allowed_domains):
                    raise ComputerUseSafetyError(
                        f"URL '{url}' is outside the allow list."
                    )

            if any(domain in url_lower for domain in self.blocked_domains):
                raise ComputerUseSafetyError(f"URL '{url}' is blocked by policy.")

        if name in {"type", "input_text", "fill"}:
            text = action.args.get("text") or action.args.get("value") or ""
            lowered = str(text).lower()
            if any(keyword in lowered for keyword in self.SENSITIVE_KEYWORDS):
                raise ComputerUseSafetyError(
                    "Attempt to type sensitive information was blocked."
                )

        if name in {"confirm_purchase", "submit_payment"} and self.require_confirmation:
            raise ComputerUseSafetyError(
                f"{name} requires human confirmation for {self.agent_role}."
            )


class GeminiComputerUseClient:
    """
    Production-ready Gemini Computer Use client.

    This client loops with Gemini 2.5, sharing browser screenshots and state,
    and executes the returned function calls through our Playwright wrapper.
    """

    _function_declarations: List[types.FunctionDeclaration]

    def __init__(
        self,
        *,
        agent_role: str = "generic",
        require_human_confirmation: bool = False,
        headless: bool = True,
    ):
        allowed_roles = {role.strip() for role in DEFAULT_ALLOWED_ROLES.split(",") if role}
        allow_env = os.getenv("COMPUTER_USE_ALLOWED_AGENTS")
        if allow_env:
            allowed_roles = {role.strip() for role in allow_env.split(",") if role.strip()}

        if agent_role not in allowed_roles:
            raise PermissionError(
                f"Computer use is disabled for agent '{agent_role}'. "
                f"Allowed agents: {', '.join(sorted(allowed_roles))}"
            )

        api_key = (
            os.getenv("GOOGLE_AI_STUDIO_KEY")
            or os.getenv("GOOGLE_API_KEY")
            or os.getenv("GEMINI_API_KEY")
        )
        if not api_key:
            raise RuntimeError(
                "GOOGLE_AI_STUDIO_KEY (or GOOGLE_API_KEY / GEMINI_API_KEY) is required "
                "for Gemini computer use."
            )

        model_name = os.getenv("GEMINI_COMPUTER_USE_MODEL", DEFAULT_MODEL)
        self.client = Client(api_key=api_key)
        self.model = model_name
        self.agent_role = agent_role
        self.require_confirmation = require_human_confirmation
        self.headless = headless

        allowed_domains = os.getenv("COMPUTER_USE_ALLOWED_DOMAINS", "")
        blocked_domains = os.getenv("COMPUTER_USE_BLOCKED_DOMAINS", "")

        self.safety_gate = ComputerUseSafetyGate(
            agent_role=agent_role,
            require_confirmation=require_human_confirmation,
            allowed_domains=allowed_domains.split(",") if allowed_domains else None,
            blocked_domains=blocked_domains.split(",") if blocked_domains else None,
        )

        self.env: Optional[PlaywrightEnv] = None
        self._chat = None
        self._steps: List[ComputerUseStep] = []

        self._function_declarations = self._build_function_declarations()

        logger.info(
            "✅ Gemini Computer Use client ready (agent=%s, model=%s)",
            agent_role,
            model_name,
        )

    async def start_browser(self, headless: Optional[bool] = None) -> None:
        if self.env:
            return
        self.env = EnvRegistry.make("playwright", headless=headless if headless is not None else self.headless)
        obs = await self.env.reset()
        logger.info("🌐 Computer-use browser started (%s)", obs.info if isinstance(obs, EnvObservation) else "no info")

    async def stop_browser(self) -> None:
        if self.env:
            await self.env.close()
            self.env = None
        self._chat = None
        logger.info("🛑 Computer-use browser stopped")

    async def navigate(self, url: str) -> None:
        await self._require_env()
        self.safety_gate.validate(ComputerUseAction(name="goto", args={"url": url}))
        await self.env.step({"type": "goto", "url": url})

    async def wait(self, milliseconds: int) -> None:
        await self._require_env()
        await self.env.step({"type": "wait", "ms": int(milliseconds)})

    async def take_screenshot(self, path: Optional[str] = None) -> str:
        await self._require_env()
        screenshot_path = path or os.path.abspath("computer_use_last.png")
        await self.env.page.screenshot(path=screenshot_path, full_page=True)
        return screenshot_path

    async def autonomous_task(
        self,
        task_description: str,
        max_steps: int = 20,
        hard_timeout_seconds: int = 600,
    ) -> Dict[str, Any]:
        await self.start_browser()
        chat = self._ensure_chat()
        deadline = asyncio.get_event_loop().time() + hard_timeout_seconds

        for step_index in range(max_steps):
            if asyncio.get_event_loop().time() >= deadline:
                logger.warning("Computer-use task timed out (%s)", task_description[:80])
                return self._build_result(success=False, final_state="timeout", error="Task timed out.")

            screenshot_bytes = await self._capture_bytes()
            prompt_parts = self._build_prompt(task_description, step_index, screenshot_bytes)

            try:
                response = await asyncio.to_thread(chat.send_message, prompt_parts)
            except ClientError as err:
                logger.error("Gemini Computer Use error: %s", err)
                return self._build_result(
                    success=False,
                    final_state="model_error",
                    error=str(err),
                )

            action = self._extract_action(response)
            if not action:
                logger.warning("No actionable response from Gemini, stopping.")
                return self._build_result(
                    success=False,
                    final_state="no_action",
                    error="Model did not return a valid function call.",
                )

            if action.name.lower() in {"complete_task", "finish", "done"}:
                return self._build_result(success=True, final_state="task_completed")

            try:
                self.safety_gate.validate(action)
                result_summary, observation = await self._execute_action(action)
            except ComputerUseSafetyError as safety_err:
                logger.warning("Action blocked by safety gate: %s", safety_err)
                return self._build_result(
                    success=False,
                    final_state="blocked_by_policy",
                    error=str(safety_err),
                )
            except Exception as exc:
                logger.exception("Failed to execute action %s", action.name)
                return self._build_result(
                    success=False,
                    final_state="execution_error",
                    error=str(exc),
                )

            self._steps.append(
                ComputerUseStep(action=action, result=result_summary, observation=observation or {})
            )

        logger.info("Computer-use max steps reached (%s)", max_steps)
        return self._build_result(
            success=False,
            final_state="step_limit",
            error="Reached maximum number of steps before completion.",
        )

    # ------------------------------------------------------------------ #
    # Internal helpers
    # ------------------------------------------------------------------ #

    async def _require_env(self) -> None:
        if not self.env:
            raise RuntimeError("Computer-use environment is not initialized. Call start_browser() first.")

    def _ensure_chat(self):
        if self._chat is None:
            config = types.GenerateContentConfig(
                tools=[
                    types.Tool(
                        function_declarations=self._function_declarations,
                        computer_use=types.ComputerUse(),
                    )
                ],
                system_instruction=(
                    "You are an autonomous UI operator. Only respond using a single "
                    "function call from the provided list. Prefer precise CSS selectors "
                    "and short text inputs. Finish with complete_task when the goal is met."
                ),
                response_modalities=["TEXT"],
            )
            self._chat = self.client.chats.create(model=self.model, config=config)
        return self._chat

    def _build_function_declarations(self) -> List[types.FunctionDeclaration]:
        schema = types.Schema
        type_enum = types.Type

        return [
            types.FunctionDeclaration(
                name="goto",
                description="Navigate the browser to the provided absolute URL.",
                parameters=schema(
                    type=type_enum.OBJECT,
                    required=["url"],
                    properties={
                        "url": schema(
                            type=type_enum.STRING,
                            description="Fully qualified URL starting with http:// or https://",
                        )
                    },
                ),
            ),
            types.FunctionDeclaration(
                name="click",
                description="Click on an element using a CSS selector.",
                parameters=schema(
                    type=type_enum.OBJECT,
                    required=["selector"],
                    properties={
                        "selector": schema(
                            type=type_enum.STRING,
                            description="CSS selector of the element to click",
                        )
                    },
                ),
            ),
            types.FunctionDeclaration(
                name="type",
                description="Type text into an input field identified by a CSS selector.",
                parameters=schema(
                    type=type_enum.OBJECT,
                    required=["selector", "text"],
                    properties={
                        "selector": schema(type=type_enum.STRING),
                        "text": schema(type=type_enum.STRING),
                        "clear": schema(
                            type=type_enum.BOOLEAN,
                            description="Whether to clear the field before typing",
                        ),
                    },
                ),
            ),
            types.FunctionDeclaration(
                name="wait",
                description="Pause for a number of milliseconds.",
                parameters=schema(
                    type=type_enum.OBJECT,
                    required=["milliseconds"],
                    properties={
                        "milliseconds": schema(
                            type=type_enum.INTEGER,
                            description="Number of milliseconds to wait (max 15000)",
                            minimum=0,
                            maximum=15000,
                        )
                    },
                ),
            ),
            types.FunctionDeclaration(
                name="scroll",
                description="Scroll the page by a delta in pixels.",
                parameters=schema(
                    type=type_enum.OBJECT,
                    properties={
                        "dx": schema(
                            type=type_enum.INTEGER,
                            description="Horizontal scroll delta in pixels",
                        ),
                        "dy": schema(
                            type=type_enum.INTEGER,
                            description="Vertical scroll delta in pixels",
                        ),
                    },
                ),
            ),
            types.FunctionDeclaration(
                name="complete_task",
                description="Call when the task is finished. Provide an optional summary.",
                parameters=schema(
                    type=type_enum.OBJECT,
                    properties={
                        "summary": schema(
                            type=type_enum.STRING,
                            description="Short summary of the accomplished work",
                        )
                    },
                ),
            ),
        ]

    async def _capture_bytes(self) -> bytes:
        await self._require_env()
        return await self.env.page.screenshot(full_page=True)

    def _build_prompt(
        self,
        task_description: str,
        step_index: int,
        screenshot_bytes: bytes,
    ) -> List[types.Part]:
        summary_lines = [
            f"Task: {task_description.strip()}",
            f"Agent role: {self.agent_role}",
            f"Step: {step_index + 1}",
        ]
        if self.env and self.env.page:
            summary_lines.append(f"Current URL: {self.env.page.url}")
        if self._steps:
            summary_lines.append("Recent actions:")
            for step in self._steps[-3:]:
                summary_lines.append(f"- {step.action.name}: {step.result}")

        prompt_text = "\n".join(summary_lines) + "\nReturn the next action."

        screenshot_part = types.Part(
            inline_data=types.Blob(
                data=screenshot_bytes,
                mime_type="image/png",
            )
        )

        return [types.Part(text=prompt_text), screenshot_part]

    def _extract_action(self, response: types.GenerateContentResponse) -> Optional[ComputerUseAction]:
        if not response or not response.candidates:
            return None
        for candidate in response.candidates:
            if not candidate.content:
                continue
            for part in candidate.content.parts or []:
                if part.function_call:
                    return ComputerUseAction(
                        name=part.function_call.name or "",
                        args=dict(part.function_call.args or {}),
                        raw_call=part.function_call,
                    )
                if part.text:
                    text = part.text.strip().lower()
                    if text.startswith("done") or text.startswith("task complete"):
                        return ComputerUseAction(name="complete_task", args={})
        return None

    async def _execute_action(self, action: ComputerUseAction) -> tuple[str, Dict[str, Any]]:
        await self._require_env()
        name = action.name.lower()
        args = action.args

        if name in {"goto", "navigate", "open_url"}:
            url = args.get("url") or args.get("target")
            if not url:
                raise ValueError("Navigation action missing url.")
            obs = await self.env.step({"type": "goto", "url": url})
            return f"Navigated to {url}", getattr(obs, "state", {})

        if name in {"click", "tap"}:
            selector = args.get("selector") or args.get("target")
            if not selector:
                raise ValueError("Click action missing selector.")
            obs = await self.env.step({"type": "click", "selector": selector})
            return f"Clicked {selector}", getattr(obs, "state", {})

        if name in {"type", "input_text", "fill"}:
            selector = args.get("selector")
            text = args.get("text") or args.get("value")
            if not selector or text is None:
                raise ValueError("Type action requires selector and text.")

            if args.get("clear", False):
                await self.env.page.fill(selector, "")
            obs = await self.env.step({"type": "type", "selector": selector, "text": str(text)})
            return f"Typed into {selector}", getattr(obs, "state", {})

        if name in {"wait", "sleep", "pause"}:
            ms = args.get("milliseconds") or args.get("ms") or args.get("seconds")
            if ms is None:
                ms = 1000
            if isinstance(ms, (float, int)) and ms < 1:
                ms = int(ms * 1000)
            obs = await self.env.step({"type": "wait", "ms": int(ms)})
            return f"Waited {int(ms)} ms", getattr(obs, "state", {})

        if name == "scroll":
            dx = int(args.get("dx", 0))
            dy = int(args.get("dy", 200))
            await self.env.page.evaluate(
                "(dx, dy) => window.scrollBy(dx, dy)", dx, dy
            )
            return f"Scrolled dx={dx} dy={dy}", {}

        raise ValueError(f"Unsupported action '{action.name}'")

    def _build_result(
        self,
        *,
        success: bool,
        final_state: str,
        error: Optional[str] = None,
    ) -> Dict[str, Any]:
        return {
            "success": success,
            "steps": len(self._steps),
            "action_log": [step.serialize() for step in self._steps],
            "final_state": final_state,
            **({"error": error} if error else {}),
        }


