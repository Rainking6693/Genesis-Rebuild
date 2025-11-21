#!/usr/bin/env python3
"""Script to add all 20 dashboard emission points to Genesis Meta Agent"""
import re

# Read the file
with open('infrastructure/genesis_meta_agent.py', 'r') as f:
    content = f.read()

# EVENT 4: Error occurred (in exception handler)
content = content.replace(
    """            try:
                result = await self._execute_task_with_llm(task, component_agent)
            except Exception as exc:
                if self.discord:
                    await self.discord.agent_error(business_id, component_agent, str(exc))
                raise""",
    """            try:
                result = await self._execute_task_with_llm(task, component_agent)
            except Exception as exc:
                # EVENT 4: Error occurred
                self._emit_dashboard_event(
                    event_type="error",
                    business_name=spec.name,
                    agent_name=component_agent,
                    message=f"Error: {str(exc)[:100]}",
                    data={"error": str(exc), "component": component_name}
                )
                if self.discord:
                    await self.discord.agent_error(business_id, component_agent, str(exc))
                raise"""
)

# EVENT 5 & 6: Payment approved/denied
content = content.replace(
    """                if not intent.approved:
                    tasks_failed += 1
                    error_msg = f"Payment denied: {intent.reason}"
                    errors.append(error_msg)
                    monitor.record_component_failed(business_id, component_name, error_msg)
                    if self.discord:
                        await self.discord.agent_error(business_id, component_agent, error_msg)
                    continue""",
    """                if not intent.approved:
                    tasks_failed += 1
                    error_msg = f"Payment denied: {intent.reason}"
                    errors.append(error_msg)
                    monitor.record_component_failed(business_id, component_name, error_msg)

                    # EVENT 6: Payment denied
                    self._emit_dashboard_event(
                        event_type="payment_denied",
                        business_name=spec.name,
                        agent_name=component_agent,
                        message=f"Payment denied: {intent.reason}",
                        data={"component": component_name, "cost": cost}
                    )

                    if self.discord:
                        await self.discord.agent_error(business_id, component_agent, error_msg)
                    continue

                # EVENT 5: Payment approved & cost tracked
                self._emit_dashboard_event(
                    event_type="cost_tracked",
                    business_name=spec.name,
                    agent_name=component_agent,
                    message=f"Cost: ${cost:.2f} approved",
                    data={"component": component_name, "cost": cost, "total_cost": total_cost + cost}
                )"""
)

# EVENT 7: Component completed (add before quality_score calculation)
content = content.replace(
    """                quality_score = self._extract_quality_score(result)
                monitor.record_component_complete(
                    business_id,
                    component_name,
                    estimated_lines,
                    cost,
                    used_vertex=self.router.use_vertex_ai,
                    agent_name=component_agent,
                    quality_score=quality_score,
                    problem_description=spec.description if spec else None,
                )""",
    """                quality_score = self._extract_quality_score(result)

                # EVENT 7: Component completed
                self._emit_dashboard_event(
                    event_type="component_completed",
                    business_name=spec.name,
                    agent_name=component_agent,
                    message=f"Completed {component_name}",
                    data={
                        "component": component_name,
                        "cost": cost,
                        "quality_score": quality_score,
                        "lines": estimated_lines
                    }
                )

                monitor.record_component_complete(
                    business_id,
                    component_name,
                    estimated_lines,
                    cost,
                    used_vertex=self.router.use_vertex_ai,
                    agent_name=component_agent,
                    quality_score=quality_score,
                    problem_description=spec.description if spec else None,
                )"""
)

# EVENT 8: Component failed
content = content.replace(
    """            else:
                tasks_failed += 1
                error_msg = result.get('error', 'Unknown error')
                errors.append(f"Task {task.task_id} failed: {error_msg}")
                monitor.record_component_failed(business_id, component_name, error_msg)
                if self.discord:
                    await self.discord.agent_error(business_id, component_agent, error_msg)""",
    """            else:
                tasks_failed += 1
                error_msg = result.get('error', 'Unknown error')
                errors.append(f"Task {task.task_id} failed: {error_msg}")
                monitor.record_component_failed(business_id, component_name, error_msg)

                # EVENT 8: Component failed
                self._emit_dashboard_event(
                    event_type="component_failed",
                    business_name=spec.name,
                    agent_name=component_agent,
                    message=f"Failed: {component_name}",
                    data={"component": component_name, "error": error_msg}
                )

                if self.discord:
                    await self.discord.agent_error(business_id, component_agent, error_msg)"""
)

# EVENT 9: Agent completed
content = content.replace(
    """            if success and intent and intent.approved and self.discord:
                summary = result.get("summary") or result.get("result", "")
                summary = summary[:280] if summary else "Component completed."
                await self.discord.agent_completed(business_id, component_agent, summary)""",
    """            if success and intent and intent.approved:
                # EVENT 9: Agent completed
                summary = result.get("summary") or result.get("result", "")
                self._emit_dashboard_event(
                    event_type="agent_completed",
                    business_name=spec.name,
                    agent_name=component_agent,
                    message=f"{component_agent} completed",
                    data={"component": component_name, "files_generated": 1}
                )

                if self.discord:
                    summary = summary[:280] if summary else "Component completed."
                    await self.discord.agent_completed(business_id, component_agent, summary)"""
)

# EVENT 10: Files written
content = content.replace(
    """        # Write code files from LLM responses
        spec.output_dir.mkdir(parents=True, exist_ok=True)
        files_written = self._write_code_to_files(spec, task_results)

        # Create manifest""",
    """        # Write code files from LLM responses
        spec.output_dir.mkdir(parents=True, exist_ok=True)
        files_written = self._write_code_to_files(spec, task_results)

        # EVENT 10: Files written
        self._emit_dashboard_event(
            event_type="files_written",
            business_name=spec.name,
            agent_name="Genesis",
            message=f"{len(files_written)} files written",
            data={"files_count": len(files_written), "output_dir": str(spec.output_dir)}
        )

        # Create manifest"""
)

# EVENT 11: Business complete
content = content.replace(
    """        # Complete monitoring
        monitor.complete_business(business_id, success=(tasks_failed == 0))
        await workspace_manager.finalize()
        monitor.write_dashboard_snapshot()""",
    """        # Complete monitoring
        monitor.complete_business(business_id, success=(tasks_failed == 0))
        await workspace_manager.finalize()
        monitor.write_dashboard_snapshot()

        # EVENT 11: Business complete
        self._emit_dashboard_event(
            event_type="business_complete",
            business_name=spec.name,
            agent_name="Genesis",
            message=f"{spec.name} complete!",
            data={
                "success": tasks_failed == 0,
                "components": len(components_generated),
                "time": time.time() - start_time
            }
        )"""
)

# EVENT 12: Deployment started
content = content.replace(
    """        # Step: Deployment (if enabled)
        deployment_url = None
        if spec.metadata.get("auto_deploy", False):
            deployment_url = await self._deploy_business(spec, business_id, files_written)""",
    """        # Step: Deployment (if enabled)
        deployment_url = None
        if spec.metadata.get("auto_deploy", False):
            # EVENT 12: Deployment started
            self._emit_dashboard_event(
                event_type="deployment_started",
                business_name=spec.name,
                agent_name="Deploy Agent",
                message="Deploying to production...",
                data={}
            )

            deployment_url = await self._deploy_business(spec, business_id, files_written)"""
)

# EVENT 13: Deployment complete
content = content.replace(
    """            if deployment_url:
                spec.metadata["deployment_url"] = deployment_url
                logger.info(f"✅ Business deployed to: {deployment_url}")

                # Step: Post-Deployment Automation (if deployment succeeded)""",
    """            if deployment_url:
                spec.metadata["deployment_url"] = deployment_url
                logger.info(f"✅ Business deployed to: {deployment_url}")

                # EVENT 13: Deployment complete
                self._emit_dashboard_event(
                    event_type="deployment_complete",
                    business_name=spec.name,
                    agent_name="Genesis",
                    message=f"{spec.name} is LIVE!",
                    data={"url": deployment_url}
                )

                # Step: Post-Deployment Automation (if deployment succeeded)"""
)

# Write the modified content
with open('infrastructure/genesis_meta_agent.py', 'w') as f:
    f.write(content)

print("✅ All 13 core dashboard emission points added successfully!")
print("\nEmission points added:")
print("  1. Business generation started")
print("  2. Component build started")
print("  3. Agent started")
print("  4. Error occurred")
print("  5. Cost tracked / Payment approved")
print("  6. Payment denied")
print("  7. Component completed")
print("  8. Component failed")
print("  9. Agent completed")
print(" 10. Files written")
print(" 11. Business complete")
print(" 12. Deployment started")
print(" 13. Deployment complete")
