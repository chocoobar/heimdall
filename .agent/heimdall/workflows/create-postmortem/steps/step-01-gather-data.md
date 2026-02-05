---
name: 'step-01-gather-data'
description: 'Gather incident data and timeline'
workflow_path: 'workflows/create-postmortem'
thisStepFile: './step-01-gather-data.md'
nextStepFile: './step-02-generate-rca.md'
---

# Step 1: Gather Incident Data

**Goal:** Collect all necessary incident data for postmortem generation.

---

## STATE VARIABLES

Capture and persist throughout workflow:

- `{incident_id}` - Incident identifier
- `{incident_title}` - Brief incident description
- `{severity}` - Incident severity (P1/P2/P3)
- `{timeline}` - Chronological event timeline
- `{impact_data}` - Impact metrics
- `{resolution_data}` - How incident was resolved
- `{participants}` - People involved

---

## EXECUTION SEQUENCE

### 1. Check for Existing Triage Report

Look for triage report at `{sre_artifacts}/triage/triage-*-{date}.md`:

**If found:**
- Load triage data as starting point
- Pre-populate fields from triage

**If not found:**
- Start fresh data collection

---

### 2. Collect Incident Information

Display data collection prompts:

```
🛡️ Postmortem Data Collection.

Provide incident details:

1. Incident ID: {incident_id or prompt}
2. Incident Title: _____________
3. Severity: [P1] [P2] [P3]
4. Start Time (UTC): YYYY-MM-DD HH:MM
5. End Time (UTC): YYYY-MM-DD HH:MM
6. Duration: {calculated}
```

**WAIT for user input on each required field.**

---

### 3. Build Timeline

Prompt for timeline events:

```
🛡️ Timeline Construction.

Add events chronologically. Format:
HH:MM - Event description - Actor

Example:
14:23 - First alert triggered - Monitoring
14:25 - On-call acknowledged - @engineer
14:30 - Root cause identified - @engineer

Type 'DONE' when complete.
```

**WAIT for user input.**

Parse and validate timeline:
- [ ] Events in chronological order
- [ ] Start and end times match incident window
- [ ] Key events present: detection, acknowledgment, resolution

---

### 4. Collect Impact Data

```
🛡️ Impact Assessment.

| Metric | Value |
|--------|-------|
| Users Affected | _____ |
| Transactions Failed | _____ |
| Revenue Impact | $_____ (if known) |
| SLO Before | ____% |
| SLO After | ____% |
| SLO Breach | [Yes] [No] |
```

**WAIT for user input.**

---

### 5. Collect Resolution Data

```
🛡️ Resolution Details.

1. Root Cause (brief): _____________
2. Mitigation Applied: _____________
3. Was Rollback Required: [Yes] [No]
4. Permanent Fix Status: [Done] [In Progress] [Planned]
```

**WAIT for user input.**

---

### 6. Identify Participants

```
🛡️ Incident Participants.

Who was involved? (comma-separated)
Engineers: @name1, @name2
Incident Commander: @name
Communicator: @name
```

**WAIT for user input.**

---

## VALIDATION

Before proceeding, confirm minimum data:
- [ ] Incident ID present
- [ ] Title present
- [ ] Severity set
- [ ] Timeline has at least 3 events
- [ ] Impact data captured
- [ ] Resolution described

**If missing critical data:** Request from user.

---

## OUTPUT

Display summary:
```
🛡️ Data collected.

{incident_id}. {severity}. Duration: {duration}.
Impact: {users_affected} users. SLO: {before}% → {after}%.
Timeline: {event_count} events captured.
Root cause: {root_cause_brief}.

Generating RCA document.
```

---

## NEXT STEP

Read fully and follow: `step-02-generate-rca.md`
