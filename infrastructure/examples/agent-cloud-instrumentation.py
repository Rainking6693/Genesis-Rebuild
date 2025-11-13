"""
Demonstrates how Genesis agents interact with cloud-managed services.

- MongoDB Atlas for durable state (via pymongo)
- Upstash Redis for ephemeral caching and coordination
- OpenTelemetry tracing exported straight to Grafana Cloud
- Optional Better Stack logging hook
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from pymongo import MongoClient
import redis
import requests


def _require_env(var_name: str) -> str:
    value = os.getenv(var_name)
    if not value:
        raise RuntimeError(f"Environment variable {var_name} is required for cloud instrumentation.")
    return value


def configure_tracing() -> trace.Tracer:
    resource = Resource.create({
        "service.name": os.getenv("OTEL_SERVICE_NAME", "genesis-agents"),
        "service.namespace": "genesis",
        "cloud.region": "global",
    })

    provider = TracerProvider(resource=resource)
    exporter = OTLPSpanExporter(
        endpoint=_require_env("GRAFANA_OTLP_ENDPOINT"),
        headers={"authorization": f"Bearer {_require_env('GRAFANA_API_KEY')}"},
    )
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)
    return trace.get_tracer(__name__)


def connect_mongodb():
    uri = _require_env("MONGODB_URI")
    client = MongoClient(uri, tls=True, tlsAllowInvalidCertificates=False)
    client.admin.command("ping")
    return client


def connect_redis():
    url = _require_env("REDIS_URL")
    client = redis.from_url(url, ssl=True)
    client.ping()
    return client


def push_betterstack_log(message: str, level: str = "info") -> None:
    token = os.getenv("BETTERSTACK_SOURCE_TOKEN")
    if not token:
        return
    payload = {
        "message": message,
        "level": level,
        "service": "genesis-agent",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    response = requests.post(
        "https://in.logs.betterstack.com/ingest",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        data=json.dumps(payload),
        timeout=5,
    )
    response.raise_for_status()


class BuilderAgent:
    def __init__(self):
        self.mongo = connect_mongodb().genesis
        self.redis = connect_redis()
        self.tracer = configure_tracing()

    def build(self, spec: dict) -> dict:
        with self.tracer.start_as_current_span("builder.build") as span:
            span.set_attribute("agent.role", "builder")
            span.set_attribute("spec.name", spec.get("name", "unknown"))

            result = {
                "name": spec.get("name"),
                "status": "completed",
                "generated_at": datetime.now(timezone.utc).isoformat(),
            }

            self.mongo.trajectories.insert_one(
                {
                    "agent": "builder",
                    "spec": spec,
                    "result": result,
                    "created_at": datetime.now(timezone.utc),
                }
            )

            self.redis.setex(
                name=f"build:{spec.get('name')}",
                time=3600,
                value=json.dumps(result),
            )

            push_betterstack_log(f"Builder agent completed {spec.get('name')}", level="info")

            return result


if __name__ == "__main__":
    agent = BuilderAgent()
    demo_spec = {"name": "demo-landing-page", "features": ["hero", "cta"]}
    print(agent.build(demo_spec))

