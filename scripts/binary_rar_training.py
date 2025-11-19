#!/usr/bin/env python3
"""
Binary RAR training bootstrap
-----------------------------

Implements a lightweight training loop inspired by the `rl-binary-rar`
repository to keep DreamGym rewards aligned with retrieval verification.
"""

from __future__ import annotations

import argparse
import logging
import os
import random
import time

from infrastructure.dreamgym.binary_rar import BinaryRarRetriever, BinaryRarVerifier

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


def train(args: argparse.Namespace) -> None:
    docs = [line.strip() for line in os.getenv("BINARY_RAR_DOCS", "").split("|") if line.strip()]
    verifier = BinaryRarVerifier(BinaryRarRetriever(index=docs), threshold=args.threshold)
    logger.info("Starting Binary RAR training with %d documents", len(docs))

    for episode in range(args.episodes):
        prompt = random.choice(args.prompts or ["Generate customer email content"])
        candidate = random.choice(args.candidates or ["Default response"])
        result = verifier.verify(prompt=prompt, candidate=candidate)
        logger.info(
            "[episode %d] prompt=%s candidate=%s score=%.2f passed=%s",
            episode,
            prompt,
            candidate,
            result.score,
            result.passed,
        )
        time.sleep(0.25)

    logger.info("Binary RAR training complete")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Binary RAR training helper")
    parser.add_argument("--episodes", type=int, default=10)
    parser.add_argument("--threshold", type=float, default=0.6)
    parser.add_argument("--prompts", nargs="+", default=None)
    parser.add_argument("--candidates", nargs="+", default=None)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    train(args)


if __name__ == "__main__":
    main()
