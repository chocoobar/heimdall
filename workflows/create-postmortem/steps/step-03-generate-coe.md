---
name: 'step-03-generate-coe'
description: 'Generate COE document using template'
workflow_path: '_bmad/sre/workflows/create-postmortem'
thisStepFile: './step-03-generate-coe.md'
nextStepFile: './step-04-publish.md'
---

# Step 3: Generate COE Document

**Goal:** Generate Correction of Errors document using template.

---

## AVAILABLE STATE

From previous steps:
- All incident data from step 1
- RCA document generated in step 2
- `{rca_path}` - Path to generated RCA

---

## TEMPLATE LOADING

1. Load COE template from `{project-root}/_bmad/sre/templates/coe-template.md`
2. Parse template sections
3. Prepare for population

---

## COE GENERATION

### 1. General Information

```yaml
COE ID: COE-{YYYY}-{NNN}
Incident ID: {incident_id}
Related RCA: RCA-{YYYY}-{NNN}
Date Created: {current_date}
Author: Heimdall (SRE Agent)
Reviewed By: {pending}
Status: Draft
```

### Incident Classification

| Field | Value |
|-------|-------|
| Incident Title | {incident_title} |
| Severity Level | {severity} |
| Incident Type | {outage/degradation/security/data_loss} |
| Affected Service(s) | {services} |
| Affected Region(s) | {regions} |

---

### 2. Impact Assessment

**Business Impact:**
| Metric | Value |
|--------|-------|
| Duration | {duration} |
| Users Affected | {users_affected} |
| Requests Failed | {transactions_failed} |
| Error Rate Peak | {peak_error_rate}% |
| Latency Impact | p99: {before}ms → {during}ms |

**SLO Impact:**
| SLO | Target | Actual | Breach |
|-----|--------|--------|--------|
| Availability | {target}% | {actual}% | {yes/no} |
| Latency | {target}ms | {actual}ms | {yes/no} |
| Error Rate | <{target}% | {actual}% | {yes/no} |

**Customer Impact:**
| Category | Details |
|----------|---------|
| Customer Complaints | {count} |
| Revenue Impact | ${amount} |
| Contractual SLA Breach | {yes/no} |

---

### 3. Timeline

Format as key milestones with timestamps:

| Time (UTC) | Event | Source |
|------------|-------|--------|
| {time} | Incident Start | Monitoring |
| {time} | Detection | {source} |
| {time} | Triage | PagerDuty |
| {time} | Escalation | {who} |
| {time} | Root Cause Identified | {who} |
| {time} | Mitigation Started | {who} |
| {time} | Mitigation Complete | {who} |
| {time} | Incident Resolved | {who} |

**Time to Key Milestones:**
| Metric | Value | Target | Met |
|--------|-------|--------|-----|
| TTD | {min} | {target} | ✓/✗ |
| TTA | {min} | {target} | ✓/✗ |
| TTM | {min} | {target} | ✓/✗ |
| TTR | {min} | {target} | ✓/✗ |

---

### 4. Root Cause Analysis

**Summary:** {one_paragraph_summary}

**Technical Details:**
- What happened: {description}
- Why it happened: {explanation}
- Why it wasn't prevented: {gap_analysis}
- Why it wasn't detected sooner: {detection_gap}

**Trigger:**
| Field | Value |
|-------|-------|
| Trigger Type | {deployment/config/traffic/dependency/other} |
| Trigger Details | {specifics} |
| Change ID | {deployment_id} |

---

### 5. Detection, Diagnosis & Mitigation

**Detection:**
| Aspect | Details |
|--------|---------|
| Detection Method | {automated/customer/manual} |
| Alert Name | {alert_name} |
| Detection Latency | {minutes} |

**Diagnosis:**
| Aspect | Details |
|--------|---------|
| Initial Hypothesis | {hypothesis} |
| Investigation Steps | {steps} |
| Diagnosis Duration | {minutes} |

**Mitigation:**
| Aspect | Details |
|--------|---------|
| Mitigation Action | {action} |
| Rollback Required | {yes/no} |
| Full Resolution | {details} |

---

### 6. Action Plan

**Immediate Actions (P1):**
| # | Action Item | Owner | Due | JIRA | Status |
|---|-------------|-------|-----|------|--------|
| 1 | {action} | {owner} | {date} | {ticket} | Open |

**Short-Term Actions (P2):**
| # | Action Item | Owner | Due | JIRA | Status |
|---|-------------|-------|-----|------|--------|
| 1 | {action} | {owner} | {date} | {ticket} | Open |

**Long-Term Actions (P3):**
| # | Action Item | Owner | Due | JIRA | Status |
|---|-------------|-------|-----|------|--------|
| 1 | {action} | {owner} | {date} | {ticket} | Open |

**Prevention Measures:**
| Category | Measure | Timeline |
|----------|---------|----------|
| Detection | {improve_alerting} | {when} |
| Prevention | {add_safeguards} | {when} |
| Recovery | {improve_ttr} | {when} |
| Process | {update_runbooks} | {when} |

---

### 7. Lessons Learned

**What Went Well:**
1. {positive_1}
2. {positive_2}

**What Didn't Go Well:**
1. {negative_1}
2. {negative_2}

**Where We Got Lucky:**
1. {lucky_1}

**Process Improvements:**
| Area | Current | Desired | Action |
|------|---------|---------|--------|
| Monitoring | {current} | {desired} | {action} |
| Runbooks | {current} | {desired} | {action} |

---

## SAVE COE DOCUMENT

Save to: `{sre_artifacts}/postmortems/coe-{incident_id}-{date}.md`

---

## OUTPUT

```
🛡️ COE generated.

Document: coe-{incident_id}-{date}.md
Sections: 7/7 complete
Action items: {count} (P1: {p1_count}, P2: {p2_count}, P3: {p3_count})

Proceeding to validation and publishing.
```

---

## NEXT STEP

Read fully and follow: `step-04-publish.md`
