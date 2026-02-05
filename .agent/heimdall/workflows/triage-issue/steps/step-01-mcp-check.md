---
name: 'step-01-mcp-check'
description: 'Check MCP availability and obtain JIRA ticket data including attachments'
workflow_path: 'workflows/triage-issue'
thisStepFile: './step-01-mcp-check.md'
nextStepFile: './step-02-analyze-issue.md'
helpers:
  - workflows/_shared/mcp-helper.md
---

# Step 1: MCP Check and Data Acquisition

**Goal:** Obtain complete JIRA ticket data (including attachments) via MCP or manual input fallback.

---

## STATE VARIABLES

Capture and persist throughout workflow:

- `{ticket_id}` - JIRA ticket identifier
- `{ticket_data}` - Complete ticket content
- `{ticket_attachments}` - List of attachments and their content
- `{mcp_status}` - MCP connection status (connected/fallback)
- `{codebase_available}` - Whether Heimdall is installed in a codebase (true/false)

---

## EXECUTION SEQUENCE

### 1. Check MCP Availability

Check if JIRA MCP is configured in `{heimdall-root}/config.yaml`:

```yaml
mcp_jira_enabled: true/false
```

**If MCP enabled:**
1. Use `list_resources` tool with `ServerName: "atlassian"` to verify connection
2. If successful, set `{mcp_status}` = "connected"
3. Proceed to retrieve ticket

**If MCP not enabled or connection fails:**
1. Set `{mcp_status}` = "fallback"
2. Display fallback guidance

---

### 2. Check Codebase Context

Check if Heimdall is installed in a codebase (not standalone):

1. Look for project files in the workspace (package.json, pom.xml, go.mod, etc.)
2. If found, set `{codebase_available}` = true
3. Store `{project_root}` = detected project root

This enables code-level root cause analysis in later steps.

---

### 3A. MCP Path (if connected)

If `{mcp_status}` = "connected":

1. Extract ticket ID from user input
2. **Retrieve ticket details** using Atlassian MCP:
   ```
   mcp_atlassian_jira_get_issue(issue_key: "{ticket_id}")
   ```

3. **Retrieve comments**:
   ```
   mcp_atlassian_jira_get_issue_comments(issue_key: "{ticket_id}")
   ```

4. **Retrieve attachments**:
   ```
   mcp_atlassian_jira_get_issue_attachments(issue_key: "{ticket_id}")
   ```

5. Store all data in `{ticket_data}`
6. Parse key fields:
   - Summary
   - Description
   - Priority
   - Status
   - Reporter
   - Assignee
   - Labels
   - Components
   - Created date
   - Comments (all)
   - **Attachments (list with names/types)**

7. **For text-based attachments** (logs, configs, stack traces):
   - If accessible via URL, attempt to read content
   - Store in `{ticket_attachments}` for analysis
   - Log files are especially valuable for root cause analysis

---

### 3B. Fallback Path (manual input)

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
- **Attachment contents (if text-based, paste relevant portions)**

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
- Stack traces
- Log snippets

Store parsed data in `{ticket_data}`.

---

### 4. Validate Ticket Data

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
Attachments: {attachment_count} files
Codebase: {Available/Not detected}

Proceeding to analysis.
```

---

## NEXT STEP

Read fully and follow: `step-02-analyze-issue.md`
