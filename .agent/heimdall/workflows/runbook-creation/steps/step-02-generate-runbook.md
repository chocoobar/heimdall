---
name: 'step-02-generate-runbook'
description: 'Generate runbook using template'
workflow_path: 'workflows/runbook-creation'
thisStepFile: './step-02-generate-runbook.md'
nextStepFile: './step-03-validate-publish.md'
---

# Step 2: Generate Runbook

**Goal:** Generate the runbook content using the template and gathered requirements.

---

## EXECUTION SEQUENCE

### 1. Load Template

Load template from `{heimdall-root}/templates/runbook-template.md`.

### 2. Populate Sections

Using `{requirements}` and `{ticket_data}` (if applicable), populate the template.

**Header:**
- ID: RB-{service}-{type}
- Status: Draft
- Owner: {primary_contact}
- Last Updated: {date}

**Overview:**
- Generate a clear purpose statement based on `{runbook_type}`.
- Define scope (what is covered/not covered).

**Prerequisites:**
- Access requirements (VPN, IAM roles).
- CLI tools needed (`kubectl`, `aws`, etc.).
- Pre-condition checks.

**Procedure:**
- Convert the gathered steps into numbered, actionable instructions.
- Add expected outputs for commands where possible.
- Use warning blocks for dangerous commands.

**Rollback/Mitigation:**
- Explicit rollback steps if deployment.
- Mitigation steps if incident.

**Verification:**
- How to confirm success.
- Metrics to check (PromQL queries if available).

**Escalation:**
- Fill in the contact details gathered in Step 1.

---

### 3. Review Draft

Display the generated runbook structure (summarized):

```
🛡️ Runbook Draft Generated.

Sections:
1. Overview: {overview_preview}
2. Procedure: {step_count} steps
3. Rollback: Defined
4. Verification: Defined

Review full content? [Y/N]
```

**WAIT for user input.**

If Y, display full content.

---

## NEXT STEP

Read fully and follow: `step-03-validate-publish.md`
