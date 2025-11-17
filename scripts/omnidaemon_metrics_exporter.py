"""Expose OmniDaemon metrics via Prometheus for Business Monitor dashboards."""

from __future__ import annotations

import time

from prometheus_client import start_http_server

from infrastructure.omnidaemon_prometheus import sync_monitor_metrics


def main() -> None:
    port = 9101
    start_http_server(port)
    print(f"OmniDaemon Prometheus exporter listening on :{port}")
    while True:
        sync_monitor_metrics()
        time.sleep(15)


if __name__ == "__main__":
    main()
