# Heimdall SRE Agent

## Quick Start

To activate Heimdall, tell your AI assistant:

```
Load and activate the Heimdall agent from .agent/heimdall/agents/heimdall.md
```

## Configuration

Edit `.agent/heimdall/config.yaml` to customize:
- Your name (user_name)
- Output folder locations
- MCP integration settings
- Prometheus endpoint

## Available Commands

Once activated, Heimdall provides these commands:
- **[TI] Triage Issue** - Analyze JIRA issues and identify root causes
- **[CP] Create Postmortem** - Generate RCA and COE documents
- **[DP] Debug Prometheus** - Validate and optimize PromQL queries
- **[PA] Performance Analysis** - Analyze metrics and recommend optimizations
- **[RC] Runbook Creation** - Create structured SRE runbooks
- **[CI] CI/CD Reliability** - Analyze pipeline health
- **[ST] SLO/SLI Tracking** - Define service level objectives
- **[OH] On-Call Handoff** - Generate handoff documentation
- **[CA] Cost Analysis** - Analyze infrastructure costs

## MCP Integration

For JIRA/Confluence integration, install the Atlassian MCP server:
https://github.com/atlassian/atlassian-mcp-server
