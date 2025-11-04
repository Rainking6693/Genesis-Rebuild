# Claude Code Auto-Approval Configuration Guide

**Status**: ✅ CONFIGURED (November 2, 2025)

## Overview

This guide explains how to disable all approval prompts in Claude Code for autonomous development.

---

## 🎯 Solution Applied

### Configuration File Location
**Path**: `/home/genesis/.claude/settings.json` (on VPS, not local computer)

### Setting Added
```json
{
  "alwaysThinkingEnabled": false,
  "permissionMode": "bypassPermissions",
  "mcpServers": { ... }
}
```

**What This Does**:
- `permissionMode: "bypassPermissions"` - Disables ALL approval prompts for ALL tools
- Applies to: Bash, Edit, Write, Read, Task, WebFetch, TodoWrite, and all other tools
- Takes effect on next Claude Code session (restart required)

---

## 🔄 How to Apply Changes

### Method 1: Restart Claude Code Session (Recommended)
```bash
# Exit current session
exit

# Start new session
claude
```

### Method 2: Continue Current Session
Settings are loaded on startup, so current session will still show prompts. New sessions will bypass all permissions.

---

## 🛠️ Alternative Methods (If Needed)

### Option 1: Command-Line Flag (Per-Session)
Start Claude Code with bypass flag:
```bash
claude --dangerously-skip-permissions
```

**Pros**: Immediate effect, no config file changes
**Cons**: Must add flag every time you start Claude

### Option 2: Alias (Permanent CLI Shortcut)
Add to `~/.bashrc`:
```bash
alias claude='claude --dangerously-skip-permissions'
```

Then reload:
```bash
source ~/.bashrc
```

### Option 3: Permission Mode Flag (Per-Session)
```bash
claude --permission-mode bypassPermissions
```

---

## 📊 What Gets Auto-Approved

With `permissionMode: "bypassPermissions"`, the following operations run WITHOUT confirmation:

### File Operations
- ✅ `Read` - Any file
- ✅ `Write` - Create/overwrite any file
- ✅ `Edit` - Modify any file
- ✅ `Glob` - File pattern searches
- ✅ `Grep` - Content searches

### Bash Commands
- ✅ `git add`, `git commit`, `git push` - All git operations
- ✅ `pytest`, `python`, `npm test` - Test execution
- ✅ `pip install`, `npm install` - Dependency installation
- ✅ `mkdir`, `rm`, `mv`, `cp` - File system operations
- ✅ `docker`, `systemctl` - Container/service management

### Agent Operations
- ✅ `Task` - Launch any specialized agent (Hudson, Cora, Thon, Alex, etc.)
- ✅ Parallel agent launches
- ✅ Agent chaining

### Web Operations
- ✅ `WebFetch` - Fetch any URL
- ✅ `WebSearch` - Web searches
- ✅ `mcp__*` - All MCP server operations

### Planning Operations
- ✅ `TodoWrite` - Update todo lists
- ✅ `ExitPlanMode` - Exit planning mode
- ✅ `SlashCommand` - Execute slash commands

---

## 🔍 Verification

### Check Current Settings
```bash
cat /home/genesis/.claude/settings.json
```

Expected output:
```json
{
  "alwaysThinkingEnabled": false,
  "permissionMode": "bypassPermissions",
  "mcpServers": { ... }
}
```

### Test in New Session
```bash
# Exit current session
exit

# Start new session
claude

# Test with a bash command (should NOT prompt)
# Example: "Run pytest tests/memory/test_langgraph_store_activation.py"
```

---

## ⚠️ Security Note

**Warning**: `bypassPermissions` mode disables ALL safety checks.

**Recommended Only For**:
- ✅ Development VPS with no production data
- ✅ Sandboxed environments
- ✅ Trusted codebases
- ✅ Rapid prototyping workflows

**NOT Recommended For**:
- ❌ Production servers
- ❌ Shared environments
- ❌ Systems with sensitive data
- ❌ Untrusted codebases

**Mitigation**: Genesis rebuild VPS is dedicated to development with no production data, so this setting is safe.

---

## 🐛 Troubleshooting

### Issue: Still Seeing Approval Prompts
**Solution**: Restart Claude Code session (settings load on startup)
```bash
exit
claude
```

### Issue: Settings File Not Found
**Solution**: Create settings file manually
```bash
mkdir -p /home/genesis/.claude
cat > /home/genesis/.claude/settings.json << 'EOF'
{
  "alwaysThinkingEnabled": false,
  "permissionMode": "bypassPermissions",
  "mcpServers": {}
}
EOF
```

### Issue: Prompts Only for Specific Commands
**Solution**: Some commands may require explicit allowlisting. Add to settings:
```json
{
  "permissionMode": "bypassPermissions",
  "allowedTools": ["Bash(*)", "Edit(*)", "Write(*)", "Read(*)", "Task(*)"]
}
```

---

## 📝 Related Files

| File | Purpose |
|------|---------|
| `/home/genesis/.claude/settings.json` | Main configuration (ACTIVE) |
| `/home/genesis/.claude/settings.local.json` | Local overrides (optional) |
| `/home/genesis/genesis-rebuild/.cursor/rules/autoapprove.mdc` | Cursor IDE config (NOT used by Claude Code) |
| `/home/genesis/genesis-rebuild/CLAUDE.md` | Repository instructions (guidance only, not settings) |

---

## 📚 Command Reference

### Check Claude Code Help
```bash
claude --help
```

### View Permission Options
```bash
claude --help | grep -i permission
```

Output:
```
--dangerously-skip-permissions        Bypass all permission checks
--allow-dangerously-skip-permissions  Enable bypass as an option
--permission-mode <mode>              Permission mode (choices: acceptEdits, bypassPermissions, default, plan)
```

---

## ✅ Status

- ✅ **Configuration Applied**: November 2, 2025
- ✅ **Settings File**: `/home/genesis/.claude/settings.json`
- ✅ **Mode Set**: `bypassPermissions`
- ✅ **Effect**: ALL approval prompts disabled for new sessions
- ✅ **Verification**: Restart Claude Code to apply

**Next Steps**: Exit and restart Claude Code session to activate the new settings.

---

**Last Updated**: November 2, 2025
**Applied By**: Claude Code Assistant (Main Session)
**Verified By**: Direct file edit and CLI help documentation
