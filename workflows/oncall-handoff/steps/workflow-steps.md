---
name: 'oncall-handoff-steps'
description: 'On-Call Handoff workflow steps'
---

# On-Call Handoff Workflow

## Step 1: Gather Current Status

```
🛡️ On-Call Handoff.

Shift Information:
- Outgoing: _______
- Incoming: _______
- Handoff Time: {current_time}
```

**WAIT for user input.**

---

## Step 2: Document Active Issues

```
🛡️ Active Issues.

Any ongoing incidents? [Y/N]
```

If yes:
```
| ID | Severity | Status | Summary |
|----|----------|--------|---------|
| ___ | P__ | _____ | _______ |
```

**WAIT for user input.**

---

## Step 3: Recent Incidents

```
🛡️ Recent Incidents (last 7 days).

List resolved incidents:
| ID | Severity | Resolution |
|----|----------|------------|
| ___ | P__ | _________ |

Type 'NONE' if no recent incidents.
```

**WAIT for user input.**

---

## Step 4: Scheduled Changes

```
🛡️ Upcoming Changes.

Any scheduled deployments or maintenance?

| Date | Time | Change | Owner |
|------|------|--------|-------|
| ____ | ____ | ______ | _____ |

Type 'NONE' if nothing scheduled.
```

**WAIT for user input.**

---

## Step 5: Things to Watch

```
🛡️ Watch Items.

Any known issues, flaky alerts, or concerns?

- _______
- _______

Type 'NONE' if nothing specific.
```

**WAIT for user input.**

---

## Step 6: Generate Handoff Document

Generate at `{sre_artifacts}/oncall/handoff-{date}.md`:

```markdown
# On-Call Handoff

## Shift Information
| Field | Value |
|-------|-------|
| Outgoing | {outgoing} |
| Incoming | {incoming} |
| Handoff | {time} |

## Active Issues
{active_issues_table}

## Recent Incidents
{recent_incidents_table}

## Scheduled Changes
{scheduled_changes_table}

## Things to Watch
{watch_items}

## Escalation Contacts
{contacts_from_config}

## Acknowledgment
- [ ] Incoming confirmed receipt
- [ ] PagerDuty verified
- [ ] On-call channel joined
```

```
🛡️ Handoff complete.

{outgoing} → {incoming}
Active: {active_count} issues
Scheduled: {scheduled_count} changes

Document: {output_path}

Safe shift! 🛡️
```
