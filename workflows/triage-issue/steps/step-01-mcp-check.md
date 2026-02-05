---
name: 'step-01-mcp-check'
description: 'Check MCP availability and obtain JIRA ticket data'
workflow_path: '_bmad/sre/workflows/triage-issue'
thisStepFile: './step-01-mcp-check.md'
nextStepFile: './step-02-analyze-issue.md'
---

# Step 1: MCP Check and Data Acquisition

**Goal:** Obtain JIRA ticket data via MCP or manual input fallback.

---

## STATE VARIABLES

Capture and persist throughout workflow:

- `{ticket_id}` - JIRA ticket identifier
- `{ticket_data}` - Complete ticket content
- `{mcp_status}` - MCP connection status (connected/fallback)

---

## EXECUTION SEQUENCE

### 1. Check MCP Availability

Check if JIRA MCP is configured in `{project-root}/_bmad/sre/config.yaml`:

```yaml
mcp_jira_enabled: true/false
```

**If MCP enabled:**
1. Attempt to list resources from JIRA MCP
2. If successful, set `{mcp_status}` = "connected"
3. Proceed to retrieve ticket

**If MCP not enabled or connection fails:**
1. Set `{mcp_status}` = "fallback"
2. Display fallback guidance

---

### 2A. MCP Path (if connected)

If `{mcp_status}` = "connected":

1. Extract ticket ID from user input
2. Retrieve ticket via JIRA MCP:
   ```
   Read resource: jira://ticket/{ticket_id}
   ```
3. Store result in `{ticket_data}`
4. Parse key fields:
   - Summary
   - Description
   - Priority
   - Status
   - Reporter
   - Assignee
   - Labels
   - Components
   - Created date
   - Comments

---

### 2B. Fallback Path (manual input)

If `{mcp_status}` = "fallback":

Display to user:
```
🛡️ JIRA MCP not available. Manual input mode.

Paste JIRA ticket content. Include:
- Ticket ID (e.g., SRE-1234)
- Summary/Title
- Description
- Priority
- Status
- Any error logs or stack traces
- Timeline of events

Type 'DONE' when complete.
```

**WAIT for user input.**

Parse pasted content for:
- Ticket ID (extract from text or ask)
- Summary line
- Description body
- Any mentioned priority
- Error patterns
- Timestamps

Store parsed data in `{ticket_data}`.

---

### 3. Validate Ticket Data

Confirm minimum required data:

- [ ] Ticket ID present
- [ ] Summary/description present
- [ ] At least some context for analysis

**If missing critical data:**
Ask user for clarification. Do not proceed with incomplete data.

---

## OUTPUT

Display confirmation:
```
🛡️ Ticket acquired.
ID: {ticket_id}
Source: {MCP | Manual input}
Status: {status}
Priority: {current_priority}

Proceeding to analysis.
```

---

## NEXT STEP

Read fully and follow: `step-02-analyze-issue.md`
