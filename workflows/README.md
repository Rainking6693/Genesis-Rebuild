## Workflows & Tool Specifications

This directory contains declarative assets that extend the Genesis orchestration
stack.  The `tools/` subdirectory hosts VoltAgent-inspired tool specifications
that are automatically loaded by the Agent-Augmented Tool Creation (AATC)
registry on startup.

### Adding New Tool Specs

1. Create a new YAML or JSON file under `workflows/tools/`.
2. Structure the file using the `tools:` list with the schema enforced by
   `infrastructure.aatc_system.ToolDefinition`.
3. Set `AATC_TOOL_SPECS_PATH` to override the default directory if required.

Changes in this folder are hot-loaded the next time the registry is
instantiated via `infrastructure.aatc_system.get_tool_registry()`.
