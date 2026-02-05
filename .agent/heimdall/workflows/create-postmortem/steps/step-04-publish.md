---
name: 'step-04-publish'
description: 'Validate and publish documents'
workflow_path: 'workflows/create-postmortem'
thisStepFile: './step-04-publish.md'
nextStepFile: null
---

# Step 4: Validate and Publish

**Goal:** Validate postmortem documents and publish to appropriate locations.

---

## AVAILABLE STATE

From previous steps:
- `{rca_path}` - Generated RCA document
- `{coe_path}` - Generated COE document
- All incident data

---

## VALIDATION

### 1. RCA Validation

Check RCA document for completeness:

**Required Sections:**
- [ ] Document Information
- [ ] Incident Summary
- [ ] Impact Assessment
- [ ] Timeline (minimum 3 events)
- [ ] 5 Whys Analysis (all 5 levels)
- [ ] Root Cause Statement
- [ ] Detection & Response
- [ ] Recommendations (at least 1 per category)
- [ ] Lessons Learned

**Quality Checks:**
- [ ] Root cause is specific (not vague)
- [ ] Timeline is chronological
- [ ] Recommendations are actionable
- [ ] No placeholders remaining

---

### 2. COE Validation

Check COE document for completeness:

**Required Sections:**
- [ ] General Information
- [ ] Impact Assessment
- [ ] Timeline with milestones
- [ ] Root Cause Analysis
- [ ] Detection, Diagnosis & Mitigation
- [ ] Action Plan (with owners and dates)
- [ ] Lessons Learned

**Quality Checks:**
- [ ] All action items have owners
- [ ] All action items have due dates
- [ ] SLO impact calculated
- [ ] No placeholders remaining

---

### 3. Cross-Document Consistency

Verify alignment between RCA and COE:
- [ ] Incident IDs match
- [ ] Timelines are consistent
- [ ] Root cause description aligns
- [ ] Action items don't conflict

---

## VALIDATION RESULT

**If validation passes:**
```
🛡️ Validation: PASS

RCA: All sections complete
COE: All sections complete
Consistency: Verified
```

**If validation fails:**
```
🛡️ Validation: ISSUES FOUND

Missing/Incomplete:
- {issue_1}
- {issue_2}

Fix issues before publishing? [Y/N]
```

**WAIT for user if issues found.**

---

## PUBLISHING

### 1. Check Confluence MCP

If `{mcp_confluence_enabled}` = true:

1. Attempt to connect to Confluence MCP
2. If connected:
   - Create RCA page in postmortem space
   - Create COE page in postmortem space
   - Link pages to each other
   - Link to incident JIRA ticket

**Confluence Success:**
```
🛡️ Published to Confluence.

RCA: {confluence_url}/rca-{incident_id}
COE: {confluence_url}/coe-{incident_id}
JIRA linked: ✓
```

### 2. Fallback: Local Storage

If Confluence not available:

```
🛡️ Confluence unavailable. Documents saved locally.

RCA: {sre_artifacts}/postmortems/rca-{incident_id}-{date}.md
COE: {sre_artifacts}/postmortems/coe-{incident_id}-{date}.md

Manual publishing required:
1. Upload RCA to Confluence
2. Upload COE to Confluence
3. Link documents to JIRA ticket {incident_id}
```

---

### 3. Create Action Item Tickets

If JIRA MCP available, offer to create tickets:

```
🛡️ Create JIRA tickets for action items?

Action items identified: {count}
- P1 (Immediate): {p1_count}
- P2 (Short-term): {p2_count}
- P3 (Long-term): {p3_count}

[Y] Create all tickets
[S] Select which to create
[N] Skip - create manually
```

**WAIT for user input.**

If creating tickets:
- Create JIRA ticket for each action item
- Link to incident ticket
- Assign to specified owner
- Set priority based on P1/P2/P3

---

## FINAL OUTPUT

```
🛡️ Postmortem complete.

{incident_id}. {severity}. Duration: {duration}.

Documents:
- RCA: {rca_location}
- COE: {coe_location}

Action Items: {total_count}
- P1: {p1_count} (due: this week)
- P2: {p2_count} (due: 2 weeks)
- P3: {p3_count} (due: 1-3 months)

Next steps:
1. Schedule postmortem review meeting
2. Assign remaining action item owners
3. Track action items to completion
```

---

## WORKFLOW COMPLETE

Offer follow-up actions:
```
Continue with:
[1] Create another postmortem
[2] Return to Menu
```

**WAIT for user input.**

---

## SUCCESS METRICS

- RCA document generated and validated
- COE document generated and validated
- Documents published (Confluence or local)
- Action items documented with owners

## FAILURE MODES

- Incomplete validation not caught
- Confluence publish failure not handled
- Action items without owners
- Missing root cause analysis
