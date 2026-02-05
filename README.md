# 🛡️ Heimdall - SRE Agent

AI-powered Site Reliability Engineering agent for incident management, root cause analysis, and reliability engineering.

## Features

| Command | Description |
|---------|-------------|
| **[TI] Triage Issue** | Analyze JIRA issues, identify root causes, assign priority |
| **[CP] Create Postmortem** | Generate RCA and COE documents using templates |
| **[DP] Debug Prometheus** | Validate PromQL syntax, suggest optimizations |
| **[PA] Performance Analysis** | Analyze metrics, DB query optimization, capacity planning |
| **[RC] Runbook Creation** | Create structured SRE runbooks with validation |
| **[CI] CI/CD Reliability** | Analyze pipeline health and recommend improvements |
| **[ST] SLO/SLI Tracking** | Define service level objectives and monitoring |
| **[OH] On-Call Handoff** | Generate structured handoff documentation |
| **[CA] Cost Analysis** | Analyze infrastructure costs and optimization |

## Installation

### Via NPX (Recommended)

```bash
npx @chocoobar/heimdall
```

This installs Heimdall into your project's `.agent/heimdall/` directory.

### Manual Installation

1. Clone this repository
2. Copy contents to `.agent/heimdall/` in your project

## Activation

After installation, tell your AI assistant:

```
Load and activate the Heimdall agent from .agent/heimdall/agents/heimdall.md
```

## Configuration

Edit `.agent/heimdall/config.yaml`:

```yaml
sre:
  user_name: "your-name"
  output_folder: "_bmad-output"
  project_name: "your-project"
  language: "English"
  
  # Output directory for SRE artifacts
  sre_artifacts: "_sre-artifacts"
  
  # MCP Configuration
  mcp_jira_enabled: true
  mcp_confluence_enabled: false
  
  # Prometheus endpoint (optional)
  prometheus_endpoint: "http://prometheus:9090"
```

## MCP Integration

Heimdall integrates with **Atlassian MCP** for JIRA/Confluence access.

### Setup

1. Install Atlassian MCP server: [atlassian-mcp-server](https://github.com/atlassian/atlassian-mcp-server)
2. Configure in your IDE/editor settings
3. Set `mcp_jira_enabled: true` in config.yaml

### Features with MCP

- **Automatic ticket retrieval** from JIRA
- **Attachment reading** (logs, configs, stack traces)
- **Publish postmortems** directly to Confluence

### Fallback Mode

If MCP is unavailable, Heimdall prompts for manual input with clear guidance.

## Workflows

### Triage Issue
```
[TI] → Acquire ticket → Analyze → Root cause → Generate report
```
- Supports JIRA MCP or manual input
- Reads ticket attachments for logs/stack traces
- Searches codebase for error patterns (when installed in a project)

### Create Postmortem
```
[CP] → Gather data → Generate RCA → Generate COE → Publish
```
- Uses 5 Whys methodology
- Generates both RCA and COE documents
- Optional Confluence publishing

### Debug Prometheus
```
[DP] → Parse query → Analyze → Optimize → Output
```
- Validates PromQL syntax
- Suggests performance optimizations
- Tests against live Prometheus (if configured)

## Output

All outputs are saved to `{sre_artifacts}/` directory:
- `postmortems/` - RCA and COE documents
- `runbooks/` - Generated runbooks
- `reports/` - Triage and analysis reports
