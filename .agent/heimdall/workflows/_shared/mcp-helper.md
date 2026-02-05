---
name: 'mcp-helper'
description: 'Reusable MCP connection check and fallback logic for Atlassian MCP'
---

# MCP Integration Helper

## Overview

This helper provides reusable functions for Atlassian MCP (JIRA/Confluence) connectivity and graceful fallback.

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
1. Check config `{mcp_jira_enabled}` in `{heimdall-root}/config.yaml`
2. If enabled, use `list_resources` tool with `ServerName: "atlassian"` to check connection
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
2. Configure Atlassian MCP: https://github.com/atlassian/atlassian-mcp-server
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
2. If enabled, use `list_resources` with `ServerName: "atlassian"`
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

**MCP Path (using Atlassian MCP tools):**
```
Use the mcp_atlassian_jira_get_issue tool with issue_key parameter
Example: mcp_atlassian_jira_get_issue(issue_key: "SRE-1234")
```

**Retrieve Full Ticket Data:**
- Issue details (summary, description, status, priority)
- Custom fields
- Comments via mcp_atlassian_jira_get_issue_comments
- Attachments via mcp_atlassian_jira_get_issue_attachments

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
- Attachments (describe or paste content)

Type 'DONE' when complete.
```

---

### Get Ticket Attachments

```yaml
function: get_jira_attachments
inputs:
  ticket_id: string
outputs:
  attachments: array
```

**MCP Path:**
```
Use mcp_atlassian_jira_get_issue_attachments(issue_key: "{ticket_id}")
Returns: List of attachment names and URLs
```

**For text-based attachments (logs, configs, etc.):**
- Download and parse content if accessible
- For images, note their presence in analysis

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
Use mcp_atlassian_confluence_create_page tool:
- space_key: Target space
- title: Document title
- content: Markdown content (will be converted)
- parent_page_id: Optional parent page
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

Reference this helper in workflow step files:

```yaml
# In step file frontmatter
helpers:
  - workflows/_shared/mcp-helper.md
```

Call functions:
```
# Check JIRA availability
{call check_jira_mcp}

# If available, get ticket with full data
{call get_jira_ticket ticket_id={ticket_id}}
{call get_jira_attachments ticket_id={ticket_id}}

# If fallback
{call parse_manual_ticket raw_content={user_input}}
```
