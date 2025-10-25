"""
ProjectStatusUpdater: Auto-update PROJECT_STATUS.md from Hierarchical Planner

Features:
- Generate markdown status reports from task state
- Organize by agent ownership
- Track progress metrics (completion %, workload distribution)
- Real-time updates during execution
- Hierarchical display (goals → subgoals → steps)

Integration:
    planner = HierarchicalPlanner(htdag, halo)
    updater = ProjectStatusUpdater(planner, status_file="PROJECT_STATUS.md")

    # Auto-update after task completion
    planner.update_task_status(task_id, TaskStatus.COMPLETED)
    updater.update_file()
"""
import logging
from typing import Dict, List, Optional
from datetime import datetime
from pathlib import Path
from orchestration.hierarchical_planner import (
    HierarchicalPlanner,
    HierarchicalTask,
    TaskStatus,
    TaskLevel
)

logger = logging.getLogger(__name__)


class ProjectStatusUpdater:
    """
    Auto-update PROJECT_STATUS.md from hierarchical planner

    Generates structured markdown reports with:
    - Overall progress metrics
    - Task breakdown by owner
    - Hierarchical task structure
    - Status emojis for visual clarity
    """

    # Status emoji mapping
    STATUS_EMOJIS = {
        TaskStatus.COMPLETED: "✅",
        TaskStatus.IN_PROGRESS: "⏳",
        TaskStatus.PENDING: "📋",
        TaskStatus.BLOCKED: "🚫",
        TaskStatus.FAILED: "❌"
    }

    # Level emoji mapping
    LEVEL_EMOJIS = {
        TaskLevel.GOAL: "🎯",
        TaskLevel.SUBGOAL: "🔹",
        TaskLevel.STEP: "▫️"
    }

    def __init__(
        self,
        planner: HierarchicalPlanner,
        status_file: str = "PROJECT_STATUS.md"
    ):
        """
        Initialize status updater

        Args:
            planner: HierarchicalPlanner instance
            status_file: Path to PROJECT_STATUS.md file
        """
        self.planner = planner
        self.status_file = Path(status_file)
        self.logger = logger

    def generate_status_report(self) -> str:
        """
        Generate markdown status report

        Returns:
            Markdown formatted status report
        """
        summary = self.planner.get_progress_summary()
        workload = self.planner.get_agent_workload()

        # Header
        report = f"""# Project Status (Auto-Generated)

**Last Updated**: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
**Completion**: {summary['completion_pct']:.1%} ({summary['completed']}/{summary['total_tasks']} tasks)

---

## 📊 Overall Progress

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Completed | {summary['completed']} | {summary['completed']/summary['total_tasks']*100 if summary['total_tasks'] > 0 else 0:.1f}% |
| ⏳ In Progress | {summary['in_progress']} | {summary['in_progress']/summary['total_tasks']*100 if summary['total_tasks'] > 0 else 0:.1f}% |
| 📋 Pending | {summary['pending']} | {summary['pending']/summary['total_tasks']*100 if summary['total_tasks'] > 0 else 0:.1f}% |
| 🚫 Blocked | {summary['blocked']} | {summary['blocked']/summary['total_tasks']*100 if summary['total_tasks'] > 0 else 0:.1f}% |
| ❌ Failed | {summary['failed']} | {summary['failed']/summary['total_tasks']*100 if summary['total_tasks'] > 0 else 0:.1f}% |

---

## 👥 Agent Workload Distribution

"""

        # Agent workload table
        if workload:
            report += "| Agent | Total | Completed | In Progress | Pending | Completion % |\n"
            report += "|-------|-------|-----------|-------------|---------|-------------|\n"

            for agent_name in sorted(workload.keys()):
                stats = workload[agent_name]
                completion_pct = stats['completed'] / stats['total'] * 100 if stats['total'] > 0 else 0
                report += (
                    f"| {agent_name} | {stats['total']} | {stats['completed']} | "
                    f"{stats['in_progress']} | {stats['pending']} | {completion_pct:.1f}% |\n"
                )
        else:
            report += "*No tasks assigned yet*\n"

        report += "\n---\n\n## 📋 Task Breakdown by Owner\n\n"

        # Group tasks by owner
        by_owner = self._group_tasks_by_owner()

        for owner in sorted(by_owner.keys()):
            tasks = by_owner[owner]
            owner_stats = workload.get(owner, {})

            # Owner section header
            report += f"### {owner}\n"
            if owner_stats:
                report += (
                    f"*{owner_stats['completed']}/{owner_stats['total']} completed "
                    f"({owner_stats['completed']/owner_stats['total']*100:.0f}%)*\n\n"
                )

            # Tasks organized by level
            goals = [t for t in tasks if t.level == TaskLevel.GOAL]
            subgoals = [t for t in tasks if t.level == TaskLevel.SUBGOAL]
            steps = [t for t in tasks if t.level == TaskLevel.STEP]

            # Goals
            for task in goals:
                report += self._format_task(task, indent=0)

            # Subgoals
            for task in subgoals:
                report += self._format_task(task, indent=1)

            # Steps
            for task in steps:
                report += self._format_task(task, indent=2)

            report += "\n"

        report += "---\n\n"
        report += f"*Report generated by HierarchicalPlanner at {datetime.now().isoformat()}*\n"

        return report

    def _group_tasks_by_owner(self) -> Dict[str, List[HierarchicalTask]]:
        """Group tasks by owner"""
        by_owner = {}

        for task in self.planner.tasks.values():
            owner = task.owner or "unassigned"
            if owner not in by_owner:
                by_owner[owner] = []
            by_owner[owner].append(task)

        return by_owner

    def _format_task(self, task: HierarchicalTask, indent: int = 0) -> str:
        """
        Format task as markdown list item

        Args:
            task: Task to format
            indent: Indentation level (0=goal, 1=subgoal, 2=step)

        Returns:
            Markdown formatted task line
        """
        status_emoji = self.STATUS_EMOJIS.get(task.status, "❓")
        level_emoji = self.LEVEL_EMOJIS.get(task.level, "")

        # Indentation
        prefix = "  " * indent

        # Duration info (if completed)
        duration_info = ""
        if task.duration():
            duration_info = f" *({task.duration():.1f}s)*"

        # Blocked info
        blocked_info = ""
        if task.status == TaskStatus.BLOCKED and task.blocked_by:
            blocked_info = f" *(blocked by: {', '.join(task.blocked_by)})*"

        return (
            f"{prefix}- {status_emoji} {level_emoji} **[{task.level.value}]** "
            f"{task.description}{duration_info}{blocked_info}\n"
        )

    def update_file(self) -> None:
        """
        Write report to PROJECT_STATUS.md

        Creates or overwrites the status file with current state
        """
        try:
            report = self.generate_status_report()

            # Write to file
            with open(self.status_file, "w") as f:
                f.write(report)

            self.logger.info(f"Updated {self.status_file}")

        except Exception as e:
            self.logger.error(f"Failed to update {self.status_file}: {e}", exc_info=True)
            raise

    def append_section(self, section_title: str, content: str) -> None:
        """
        Append custom section to status file

        Args:
            section_title: Section heading
            content: Section content (markdown)
        """
        try:
            # Read existing content
            if self.status_file.exists():
                with open(self.status_file, "r") as f:
                    existing = f.read()
            else:
                existing = ""

            # Append new section
            new_section = f"\n---\n\n## {section_title}\n\n{content}\n"
            with open(self.status_file, "w") as f:
                f.write(existing + new_section)

            self.logger.info(f"Appended section '{section_title}' to {self.status_file}")

        except Exception as e:
            self.logger.error(f"Failed to append section: {e}", exc_info=True)
            raise
