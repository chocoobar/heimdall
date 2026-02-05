---
name: 'mcp-helper'
description: 'Reusable MCP connection check and fallback logic'
---

# MCP Integration Helper

## Overview

This helper provides reusable functions for MCP connectivity and graceful fallback.

---

## MCP Availability Check

### Check JIRA MCP

```yaml
function: check_jira_mcp
inputs: none
outputs:
  available: boolean
  fallback_required: boolean
```

**Logic:**
1. Check config `{mcp_jira_enabled}` in `_bmad/sre/config.yaml`
2. If enabled, attempt to list resources from JIRA MCP
3. Return availability status

**If available:**
- Set `{jira_mcp_status}` = "connected"
- Proceed with MCP operations

**If unavailable:**
- Set `{jira_mcp_status}` = "fallback"
- Display fallback guidance:
```
🛡️ JIRA MCP unavailable.

Options:
1. Paste JIRA ticket content manually
2. Configure JIRA MCP: https://docs.example.com/jira-mcp-setup
```

---

### Check Confluence MCP

```yaml
function: check_confluence_mcp
inputs: none
outputs:
  available: boolean
  fallback_required: boolean
```

**Logic:**
1. Check config `{mcp_confluence_enabled}`
2. If enabled, attempt connection
3. Return availability status

**If available:**
- Enable Confluence publishing features

**If unavailable:**
- Disable auto-publish
- Output documents locally
- Provide manual publish instructions

---

## JIRA Operations

### Get Ticket

```yaml
function: get_jira_ticket
inputs:
  ticket_id: string
outputs:
  ticket_data: object
  success: boolean
```

**MCP Path:**
```
Resource: jira://ticket/{ticket_id}
```

**Fallback Path:**
```
🛡️ Paste JIRA ticket content.

Include:
- Ticket ID
- Summary
- Description
- Status
- Priority
- Comments (if relevant)

Type 'DONE' when complete.
```

---

### Parse Manual Ticket

```yaml
function: parse_manual_ticket
inputs:
  raw_content: string
outputs:
  ticket_data: object
```

**Parsing rules:**
1. Extract ticket ID: Pattern `[A-Z]+-\d+`
2. Extract summary: First line or "Summary:" field
3. Extract description: Content after summary
4. Extract priority: P1/P2/P3 or High/Medium/Low mapping
5. Extract status: Open/In Progress/Resolved etc.
6. Extract error patterns: Stack traces, error codes

---

## Confluence Operations

### Publish Document

```yaml
function: publish_to_confluence
inputs:
  document_path: string
  space_key: string
  parent_page_id: string (optional)
outputs:
  page_url: string
  success: boolean
```

**MCP Path:**
```
Create page via Confluence MCP
Link to parent if specified
Return page URL
```

**Fallback:**
```
🛡️ Document saved locally.

To publish manually:
1. Open: {local_path}
2. Navigate to Confluence: {space_url}
3. Create new page
4. Paste content

Local file: {output_path}
```

---

## Error Handling

### Connection Failure Mid-Workflow

If MCP connection fails during workflow:

1. Log error with context
2. Save work in progress locally
3. Notify user with recovery options:
```
🛡️ MCP connection lost.

Progress saved: {path}
Options:
[1] Retry connection
[2] Continue in fallback mode
[3] Save and exit
```

4. Allow workflow continuation in fallback mode

---

## Usage in Workflows

Import in workflow step files:

```yaml
# In step file frontmatter
helpers:
  - _bmad/sre/workflows/_shared/mcp-helper.md
```

Call functions:
```
# Check JIRA availability
{call check_jira_mcp}

# If available, get ticket
{call get_jira_ticket ticket_id={ticket_id}}

# If fallback
{call parse_manual_ticket raw_content={user_input}}
```
