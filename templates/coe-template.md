# Correction of Errors (COE) / Post-Incident Report

## General Information

| Field | Value |
|-------|-------|
| **COE ID** | COE-{YYYY}-{NNN} |
| **Incident ID** | {INCIDENT_ID} |
| **Related RCA** | RCA-{YYYY}-{NNN} |
| **Date Created** | {DATE} |
| **Author** | {AUTHOR} |
| **Reviewed By** | {REVIEWER} |
| **Status** | Draft / Pending Review / Approved / Closed |

### Incident Classification

| Field | Value |
|-------|-------|
| **Incident Title** | {TITLE} |
| **Severity Level** | P1 - Critical / P2 - High / P3 - Medium |
| **Incident Type** | Outage / Degradation / Security / Data Loss |
| **Affected Service(s)** | {SERVICES} |
| **Affected Region(s)** | {REGIONS} |

---

## Impact Assessment

### Business Impact

| Metric | Value | Notes |
|--------|-------|-------|
| **Duration** | {HH:MM} | Time from start to full recovery |
| **Users Affected** | {NUMBER} | Total unique users impacted |
| **Requests Failed** | {NUMBER} | Total failed API calls / transactions |
| **Error Rate Peak** | {PERCENTAGE}% | Maximum error rate during incident |
| **Latency Impact** | p99: {MS}ms → {MS}ms | Before → During incident |

### SLO Impact

| SLO | Target | Actual (Post-Incident) | Breach |
|-----|--------|------------------------|--------|
| Availability | {TARGET}% | {ACTUAL}% | Yes/No |
| Latency (p99) | {TARGET}ms | {ACTUAL}ms | Yes/No |
| Error Rate | <{TARGET}% | {ACTUAL}% | Yes/No |

### Customer Impact

| Category | Details |
|----------|---------|
| **Customer Complaints** | {NUMBER} tickets created |
| **Revenue Impact** | ${AMOUNT} (estimated) |
| **Contractual SLA Breach** | Yes/No - {DETAILS} |

---

## Timeline

### Key Timestamps

| Time (UTC) | Event | Source |
|------------|-------|--------|
| {TIMESTAMP} | **Incident Start**: First anomaly detected | Monitoring |
| {TIMESTAMP} | **Detection**: Alert fired / Customer report | {SOURCE} |
| {TIMESTAMP} | **Triage**: On-call acknowledged | PagerDuty |
| {TIMESTAMP} | **Escalation**: {TEAM} engaged | {WHO} |
| {TIMESTAMP} | **Root Cause Identified** | {WHO} |
| {TIMESTAMP} | **Mitigation Started**: {ACTION} | {WHO} |
| {TIMESTAMP} | **Mitigation Complete**: Service recovering | {WHO} |
| {TIMESTAMP} | **Incident Resolved**: All clear | {WHO} |

### Time to Key Milestones

| Metric | Value | Target | Met |
|--------|-------|--------|-----|
| Time to Detect (TTD) | {MINUTES} min | {TARGET} min | ✓/✗ |
| Time to Acknowledge (TTA) | {MINUTES} min | {TARGET} min | ✓/✗ |
| Time to Mitigate (TTM) | {MINUTES} min | {TARGET} min | ✓/✗ |
| Time to Recover (TTR) | {MINUTES} min | {TARGET} min | ✓/✗ |

---

## Root Cause Analysis

### Summary

**Root Cause Statement:**
{ONE_PARAGRAPH_DESCRIPTION_OF_ROOT_CAUSE}

### Technical Details

**What happened:**
{DETAILED_TECHNICAL_EXPLANATION}

**Why it happened:**
{EXPLANATION_OF_UNDERLYING_CAUSE}

**Why it wasn't prevented:**
{EXPLANATION_OF_GAP_IN_PREVENTION}

**Why it wasn't detected sooner:**
{EXPLANATION_OF_DETECTION_GAP}

### Trigger

| Field | Value |
|-------|-------|
| **Trigger Type** | Deployment / Config Change / Traffic Spike / Dependency Failure / Other |
| **Trigger Details** | {SPECIFIC_DETAILS} |
| **Change ID** | {DEPLOYMENT_ID_OR_CHANGE_TICKET} |

---

## Detection, Diagnosis & Mitigation

### Detection

| Aspect | Details |
|--------|---------|
| **Detection Method** | Automated Alert / Customer Report / Manual Discovery |
| **Alert Name** | {ALERT_NAME} |
| **Alert Threshold** | {THRESHOLD_DETAILS} |
| **Detection Latency** | {MINUTES} minutes after incident start |

### Diagnosis

| Aspect | Details |
|--------|---------|
| **Initial Hypothesis** | {WHAT_WAS_SUSPECTED} |
| **Investigation Steps** | {KEY_STEPS_TAKEN} |
| **Diagnosis Duration** | {MINUTES} minutes |
| **Tools Used** | {MONITORING_TOOLS_DASHBOARDS} |

### Mitigation

| Aspect | Details |
|--------|---------|
| **Mitigation Action** | {WHAT_WAS_DONE} |
| **Rollback Required** | Yes/No - {DETAILS} |
| **Temporary Fix** | Yes/No - {DETAILS} |
| **Full Resolution** | {PERMANENT_FIX_DETAILS} |

---

## Action Plan

### Immediate Actions (P1 - Complete within 24-48 hours)

| # | Action Item | Owner | Due Date | JIRA | Status |
|---|-------------|-------|----------|------|--------|
| 1 | {ACTION} | {OWNER} | {DATE} | {TICKET} | Open/Done |
| 2 | {ACTION} | {OWNER} | {DATE} | {TICKET} | Open/Done |

### Short-Term Actions (P2 - Complete within 1-2 weeks)

| # | Action Item | Owner | Due Date | JIRA | Status |
|---|-------------|-------|----------|------|--------|
| 1 | {ACTION} | {OWNER} | {DATE} | {TICKET} | Open/Done |
| 2 | {ACTION} | {OWNER} | {DATE} | {TICKET} | Open/Done |

### Long-Term Actions (P3 - Complete within 1-3 months)

| # | Action Item | Owner | Due Date | JIRA | Status |
|---|-------------|-------|----------|------|--------|
| 1 | {ACTION} | {OWNER} | {DATE} | {TICKET} | Open/Done |
| 2 | {ACTION} | {OWNER} | {DATE} | {TICKET} | Open/Done |

### Prevention Measures

| Category | Measure | Timeline |
|----------|---------|----------|
| **Detection** | {IMPROVE_ALERTING} | {WHEN} |
| **Prevention** | {ADD_SAFEGUARDS} | {WHEN} |
| **Recovery** | {IMPROVE_TTR} | {WHEN} |
| **Process** | {UPDATE_RUNBOOKS} | {WHEN} |

---

## Lessons Learned

### What Went Well

1. {POSITIVE_1}
2. {POSITIVE_2}
3. {POSITIVE_3}

### What Didn't Go Well

1. {NEGATIVE_1}
2. {NEGATIVE_2}
3. {NEGATIVE_3}

### Where We Got Lucky

1. {LUCKY_1}
2. {LUCKY_2}

### Process Improvements

| Area | Current State | Desired State | Action Required |
|------|---------------|---------------|-----------------|
| Monitoring | {CURRENT} | {DESIRED} | {ACTION} |
| Runbooks | {CURRENT} | {DESIRED} | {ACTION} |
| Communication | {CURRENT} | {DESIRED} | {ACTION} |
| Testing | {CURRENT} | {DESIRED} | {ACTION} |

---

## Appendix

### A. Related Documents

- RCA Document: [RCA-{ID}]({LINK})
- Incident Timeline: [{CONFLUENCE_LINK}]({URL})
- Monitoring Dashboard: [{GRAFANA_LINK}]({URL})
- Deployment Details: [{DEPLOY_LINK}]({URL})

### B. Communication Log

| Time | Channel | Message Summary |
|------|---------|-----------------|
| {TIME} | #incident-{ID} | Incident declared |
| {TIME} | Status Page | Customer notification posted |
| {TIME} | #incident-{ID} | All clear |

### C. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {DATE} | {AUTHOR} | Initial draft |
| 1.1 | {DATE} | {AUTHOR} | Added action items |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Author | {NAME} | {DATE} | ☐ |
| Team Lead | {NAME} | {DATE} | ☐ |
| Engineering Manager | {NAME} | {DATE} | ☐ |
| VP Engineering (P1 only) | {NAME} | {DATE} | ☐ |

---

*This is a blameless post-incident report. The goal is to learn and improve our systems, not to assign blame.*
