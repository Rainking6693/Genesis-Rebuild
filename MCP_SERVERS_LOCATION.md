# MCP Servers Location

## catalog-search MCP Server

**Location**: `/home/genesis/mcp-servers/catalog-search/`

**Note**: MCP servers are stored in `/home/genesis/mcp-servers/` (outside the genesis-rebuild git repository) because:
1. They are system-level tools (like global npm packages)
2. They include large node_modules/ directories (90+ packages)
3. They are referenced in `/home/genesis/.claude.json` (system config)
4. They can be shared across multiple projects

## Files

```
/home/genesis/mcp-servers/catalog-search/
├── package.json           # Dependencies
├── package-lock.json      # Lock file
├── index.js              # MCP server implementation
├── README.md             # Full documentation
└── node_modules/         # 90 packages (not in git)
```

## Configuration

**System Config**: `/home/genesis/.claude.json`
```json
{
  "projects": {
    "/home/genesis/genesis-rebuild": {
      "mcpServers": {
        "catalog-search": {
          "type": "stdio",
          "command": "node",
          "args": ["/home/genesis/mcp-servers/catalog-search/index.js"],
          "env": {}
        }
      }
    }
  }
}
```

## Setup Guide

See: `/home/genesis/MCP_CATALOG_SEARCH_SETUP.md`

## Usage

After restarting Claude Code:
```
"Search the catalog for embedding tools"
```

Claude will use the `search_catalog` tool to discover Genesis tools before calling them.

## Adding More Tools

Edit `/home/genesis/mcp-servers/catalog-search/index.js` and add to the `toolCatalog` array.

---

**Created**: November 5, 2025
**Status**: Installed and configured ✅
**Type**: System-level MCP server (outside git repo)
