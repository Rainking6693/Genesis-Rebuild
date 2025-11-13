import asyncio
from pathlib import Path

import pytest

from infrastructure.casebank import CaseBank
from infrastructure.memory.genesis_sql_memory import GenesisSQLMemoryBackend
from infrastructure.memory.memori_client import MemoriClient
from infrastructure.trajectory_pool import Trajectory, TrajectoryPool


def test_sql_memory_backend_put_get(tmp_path, monkeypatch):
    db_path = tmp_path / "memori.db"
    monkeypatch.setenv("MEMORI_DB_PATH", str(db_path))
    monkeypatch.setenv("GENESIS_MEMORY_BACKEND", "memori")
    client = MemoriClient(str(db_path))
    backend = GenesisSQLMemoryBackend(client)

    async def scenario():
        await backend.put(("agent", "qa"), "prefs", {"level": 1}, {"owner": "qa"})
        record = await backend.get(("agent", "qa"), "prefs")
        assert record is not None
        results = await backend.search(("agent", "qa"))
        assert len(results) == 1

    asyncio.run(scenario())


def test_casebank_sql_roundtrip(tmp_path, monkeypatch):
    db_path = tmp_path / "memori_cases.db"
    monkeypatch.setenv("MEMORI_DB_PATH", str(db_path))
    monkeypatch.setenv("GENESIS_MEMORY_BACKEND", "memori")
    client = MemoriClient(str(db_path))

    bank = CaseBank(backend="sql", memori_client=client)

    async def scenario():
        await bank.add_case("state", "action", 0.9, {"agent": "qa"})
        assert len(bank.cases) == 1
        await bank.clear_cases()
        assert len(bank.cases) == 0

    asyncio.run(scenario())


def test_trajectory_pool_sql_mirror(tmp_path, monkeypatch):
    db_path = tmp_path / "memori_traj.db"
    monkeypatch.setenv("MEMORI_DB_PATH", str(db_path))
    monkeypatch.setenv("GENESIS_MEMORY_BACKEND", "memori")

    pool = TrajectoryPool(agent_name="builder_agent")
    trajectory = Trajectory(
        trajectory_id="traj-123",
        generation=1,
        agent_name="builder_agent",
        operator_applied="revision",
        success_score=0.8,
        code_changes="print('hi')",
    )
    pool.add_trajectory(trajectory)
    assert pool.sql_mirror is not None
    recent = pool.sql_mirror.recent()
    assert recent, "SQL mirror should record trajectories"
