#!/usr/bin/env python3
"""
Heuristic log scanner for credential leaks.
Uses regex + entropy-style heuristic from infrastructure.security_utils.redact_credentials.
Intended as a low-cost alternative to full LLM scanning.
"""

import argparse
import pathlib
import re
from infrastructure.security_utils import redact_credentials


def scan_file(path: pathlib.Path) -> list[str]:
    hits = []
    try:
        content = path.read_text(errors="ignore")
    except Exception as e:
        return [f"{path}: read error {e}"]

    redacted = redact_credentials(content)
    if redacted != content:
        hits.append(f"{path}: credential-like patterns found (redaction applied).")

    # High-entropy token heuristic
    for match in re.finditer(r"[A-Za-z0-9_\-=]{32,}", content):
        hits.append(f"{path}: high-entropy token candidate '{match.group(0)[:8]}...'")
    return hits


def main():
    parser = argparse.ArgumentParser(description="Scan logs for potential credential leaks.")
    parser.add_argument("logdir", nargs="?", default="logs", help="Directory containing logs (default: logs)")
    args = parser.parse_args()

    root = pathlib.Path(args.logdir)
    if not root.exists():
        print(f"No log directory found at {root}")
        return 1

    findings = []
    for path in root.rglob("*"):
        if path.is_file():
            findings.extend(scan_file(path))

    if findings:
        print("Potential credential findings:")
        for f in findings:
            print(f" - {f}")
        return 2

    print("No credential-like patterns detected.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
