---
name: 'step-02-generate-rca'
description: 'Generate RCA document using template'
workflow_path: '_bmad/sre/workflows/create-postmortem'
thisStepFile: './step-02-generate-rca.md'
nextStepFile: './step-03-generate-coe.md'
---

# Step 2: Generate RCA Document

**Goal:** Generate comprehensive Root Cause Analysis using template.

---

## AVAILABLE STATE

From previous step:
- `{incident_id}`, `{incident_title}`, `{severity}`
- `{timeline}` - Event timeline
- `{impact_data}` - Impact metrics
- `{resolution_data}` - Resolution details
- `{participants}` - People involved

---

## TEMPLATE LOADING

1. Load RCA template from `{project-root}/_bmad/sre/templates/rca-template.md`
2. Parse template sections
3. Prepare for population

---

## RCA GENERATION

### 1. Document Information

Populate document header:
```yaml
RCA ID: RCA-{YYYY}-{NNN}
Incident ID: {incident_id}
Date Created: {current_date}
Author: Heimdall (SRE Agent) + {participants}
Status: Draft
```

---

### 2. Incident Summary

Generate from collected data:

| Field | Value |
|-------|-------|
| Incident Title | {incident_title} |
| Severity | {severity} |
| Start Time | {start_time} |
| End Time | {end_time} |
| Duration | {duration} |
| MTTR | {calculated_mttr} |
| Impact | {impact_summary} |

---

### 3. Impact Assessment

Format impact data:

| Metric | Value |
|--------|-------|
| Users Affected | {users_affected} |
| Transactions Failed | {transactions_failed} |
| Revenue Impact | {revenue_impact} |
| SLO Breach | {slo_before}% → {slo_after}% |

---

### 4. Timeline

Format collected timeline:

| Timestamp | Event | Actor |
|-----------|-------|-------|
| {time_1} | {event_1} | {actor_1} |
| {time_2} | {event_2} | {actor_2} |
| ... | ... | ... |

Ensure key milestones are highlighted:
- First alert
- Acknowledgment
- Investigation start
- Root cause identified
- Mitigation applied
- Resolution confirmed

---

### 5. Five Whys Analysis

Generate 5 Whys based on collected root cause:

```
Why 1: Why did {incident_symptom} occur?
→ {immediate_cause}

Why 2: Why did {immediate_cause} happen?
→ {second_level}

Why 3: Why did {second_level} happen?
→ {third_level}

Why 4: Why did {third_level} happen?
→ {fourth_level}

Why 5: Why did {fourth_level} happen?
→ {root_cause}
```

**Note:** If user provided root cause is insufficient, generate logical chain.

---

### 6. Root Cause Statement

Generate clear root cause statement:

```
Primary Root Cause:
{clear_statement_of_fundamental_cause}

Contributing Factors:
- {factor_1}
- {factor_2}
- {factor_3}
```

---

### 7. Detection & Response

| Aspect | Details |
|--------|---------|
| How Detected | {detection_method} |
| Detection Time | {minutes_from_start} |
| Response Time | {minutes_from_detection} |
| Escalation Path | {teams_involved} |

---

### 8. Recommendations

Generate actionable recommendations:

**Immediate (< 1 week):**
| # | Action | Owner | Status |
|---|--------|-------|--------|
| 1 | {action} | {owner} | Open |

**Short-term (1-4 weeks):**
| # | Action | Owner | Status |
|---|--------|-------|--------|
| 1 | {action} | {owner} | Open |

**Long-term (> 4 weeks):**
| # | Action | Owner | Status |
|---|--------|-------|--------|
| 1 | {action} | {owner} | Open |

---

### 9. Lessons Learned

Generate based on incident:

**What Went Well:**
- {positive_1}
- {positive_2}

**What Could Be Improved:**
- {improvement_1}
- {improvement_2}

---

## SAVE RCA DOCUMENT

Save to: `{sre_artifacts}/postmortems/rca-{incident_id}-{date}.md`

---

## OUTPUT

```
🛡️ RCA generated.

Document: rca-{incident_id}-{date}.md
Sections: 9/9 complete
5 Whys: Complete
Action items: {count}

Generating COE document.
```

---

## NEXT STEP

Read fully and follow: `step-03-generate-coe.md`
