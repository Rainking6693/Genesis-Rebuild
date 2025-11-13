#!/usr/bin/env python3
"""
Push the static Genesis dashboard bundle to PythonAnywhere and reload the site.

Prerequisites:
  - Run `scripts/export_dashboard_metrics.py` to refresh dashboard-data.json
  - Set PYTHONANYWHERE_USERNAME and PYTHONANYWHERE_TOKEN environment variables
    (or pass --username/--token flags).
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path
from typing import Iterable, List, Tuple

import requests

API_ROOT = "https://www.pythonanywhere.com/api/v0"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--username",
        default=os.getenv("PYTHONANYWHERE_USERNAME", "rainking632"),
        help="PythonAnywhere account username.",
    )
    parser.add_argument(
        "--token",
        default=os.getenv("PYTHONANYWHERE_TOKEN"),
        help="PythonAnywhere API token.",
    )
    parser.add_argument(
        "--domain",
        default=os.getenv("PYTHONANYWHERE_DOMAIN", "rainking632.pythonanywhere.com"),
        help="Domain name for the dashboard webapp.",
    )
    parser.add_argument(
        "--remote-dir",
        type=Path,
        default=Path("/home/rainking632/genesis_dashboard"),
        help="Remote directory where static assets will be uploaded.",
    )
    parser.add_argument(
        "--assets",
        type=Path,
        default=Path("monitoring/dashboard_static"),
        help="Local directory containing the dashboard bundle.",
    )
    parser.add_argument(
        "--upload-only",
        action="store_true",
        help="Upload files without touching webapp/static mappings.",
    )
    return parser.parse_args()


def api_request(
    method: str,
    username: str,
    token: str,
    path: str,
    **kwargs,
) -> requests.Response:
    url = f"{API_ROOT}/user/{username}{path}"
    headers = kwargs.pop("headers", {})
    headers["Authorization"] = f"Token {token}"
    response = requests.request(method, url, headers=headers, timeout=30, **kwargs)
    if response.status_code >= 400:
        raise RuntimeError(
            f"{method} {url} failed: {response.status_code} {response.text[:200]}"
        )
    return response


def upload_files(
    username: str,
    token: str,
    local_dir: Path,
    remote_dir: Path,
    filenames: Iterable[str],
) -> List[Tuple[Path, Path]]:
    uploaded: List[Tuple[Path, Path]] = []
    for name in filenames:
        local_path = (local_dir / name).resolve()
        remote_path = remote_dir / name
        if not local_path.exists():
            raise FileNotFoundError(f"Missing asset: {local_path}")
        with local_path.open("rb") as handle:
            api_request(
                "POST",
                username,
                token,
                f"/files/path{remote_path.as_posix()}",
                files={"content": (name, handle)},
            )
        uploaded.append((local_path, remote_path))
    return uploaded


def ensure_webapp(username: str, token: str, domain: str) -> None:
    response = api_request("GET", username, token, "/webapps/")
    apps = response.json()
    if not any(app.get("domain_name") == domain for app in apps):
        api_request(
            "POST",
            username,
            token,
            "/webapps/",
            data={"domain_name": domain, "python_version": "python312"},
        )


def ensure_static_mapping(
    username: str, token: str, domain: str, remote_dir: Path
) -> None:
    response = api_request("GET", username, token, f"/webapps/{domain}/static_files/")
    mappings = response.json()
    for mapping in mappings:
        if mapping.get("url") == "/":
            return
    api_request(
        "POST",
        username,
        token,
        f"/webapps/{domain}/static_files/",
        data={"url": "/", "path": remote_dir.as_posix()},
    )


def reload_webapp(username: str, token: str, domain: str) -> None:
    api_request("POST", username, token, f"/webapps/{domain}/reload/", data={})


def main() -> None:
    args = parse_args()
    if not args.token:
        raise SystemExit("PYTHONANYWHERE_TOKEN not provided.")

    assets = ["index.html", "style.css", "dashboard.js", "dashboard-data.json"]
    uploaded = upload_files(
        args.username,
        args.token,
        args.assets,
        args.remote_dir,
        assets,
    )
    print("Uploaded:")
    for local, remote in uploaded:
        print(f"  {local} -> {remote}")

    if not args.upload_only:
        ensure_webapp(args.username, args.token, args.domain)
        ensure_static_mapping(args.username, args.token, args.domain, args.remote_dir)
        reload_webapp(args.username, args.token, args.domain)
        print(f"Webapp {args.domain} reloaded.")


if __name__ == "__main__":
    main()
