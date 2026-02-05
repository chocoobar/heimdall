---
name: 'step-03-validate-publish'
description: 'Validate completeness and publish'
workflow_path: 'workflows/runbook-creation'
thisStepFile: './step-03-validate-publish.md'
nextStepFile: null
---

# Step 3: Validate and Publish

**Goal:** Ensure runbook quality and publish to artifacts/Confluence.

---

## VALIDATION

Check the generated content:

**Completeness Gates:**
- [ ] No placeholder text (e.g. `TODO`, `_____`)
- [ ] All logical steps are numbered
- [ ] Code blocks have language hints
- [ ] Rollback section is populated (if applicable)

**Logic Check:**
- Are commands safe? (No potentially destructive commands without warning)
- Is the flow chronological?

**Output Validation Status:**

```
🛡️ Validation Result.

Status: {PASS / FAIL}
Issues: {list_of_issues}
```

If FAIL, ask user for corrections or confirmation to proceed anyway.

---

## PUBLISHING

### 1. Save Local Artifact
Save to `{sre_artifacts}/runbooks/{service}-{runbook_type}-{date}.md`.

### 2. Confluence Publish (if enabled)
If `{mcp_confluence_enabled}` is true, attempt to create a page in the SRE/Runbooks space.

**Confluence Output:**
```
Page created: {confluence_url}
Parent: SRE Runbooks / {service_name}
```

---

## FINAL OUTPUT

```
🛡️ Runbook Creation Complete.

Title: {service} {runbook_type} Runbook
Location: {output_path}
Publish Status: {published_status}

Next actions:
[1] Test runbook (Walkthrough)
[2] Create another runbook
[3] Return to menu
```
