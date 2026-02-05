# Root Cause Analysis (RCA) Template

## Document Information

| Field | Value |
|-------|-------|
| **RCA ID** | RCA-{YYYY}-{NNN} |
| **Incident ID** | {INCIDENT_ID} |
| **Date Created** | {DATE} |
| **Author** | {AUTHOR} |
| **Status** | Draft / In Review / Approved |

---

## 1. Incident Summary

### 1.1 Overview

| Field | Value |
|-------|-------|
| **Incident Title** | {BRIEF_DESCRIPTION} |
| **Severity** | P1 / P2 / P3 |
| **Start Time** | {YYYY-MM-DD HH:MM:SS TZ} |
| **End Time** | {YYYY-MM-DD HH:MM:SS TZ} |
| **Duration** | {HH:MM} |
| **MTTR** | {HH:MM} |
| **Impact** | {BRIEF_IMPACT_STATEMENT} |

### 1.2 Impact Assessment

| Metric | Value |
|--------|-------|
| **Users Affected** | {NUMBER} |
| **Transactions Failed** | {NUMBER} |
| **Revenue Impact** | {AMOUNT} (if applicable) |
| **SLO Breach** | Yes/No - From {PREVIOUS}% to {CURRENT}% |

---

## 2. Timeline of Events

| Timestamp | Event | Actor |
|-----------|-------|-------|
| {HH:MM} | First alert triggered | Monitoring |
| {HH:MM} | On-call engineer paged | PagerDuty |
| {HH:MM} | Investigation started | {NAME} |
| {HH:MM} | Root cause identified | {NAME} |
| {HH:MM} | Mitigation applied | {NAME} |
| {HH:MM} | Service restored | {NAME} |
| {HH:MM} | All clear confirmed | {NAME} |

---

## 3. Root Cause Analysis

### 3.1 Five Whys Analysis

| Level | Question | Answer |
|-------|----------|--------|
| **Why 1** | Why did the incident occur? | {ANSWER} |
| **Why 2** | Why did {previous answer} happen? | {ANSWER} |
| **Why 3** | Why did {previous answer} happen? | {ANSWER} |
| **Why 4** | Why did {previous answer} happen? | {ANSWER} |
| **Why 5** | Why did {previous answer} happen? | {ANSWER} |

### 3.2 Root Cause Statement

**Primary Root Cause:**
{CLEAR_STATEMENT_OF_THE_FUNDAMENTAL_CAUSE}

**Contributing Factors:**
- {FACTOR_1}
- {FACTOR_2}
- {FACTOR_3}

### 3.3 Fishbone Diagram Categories

```
                                    [INCIDENT]
                                        |
        +---------------+---------------+---------------+---------------+
        |               |               |               |               |
    [People]       [Process]       [Technology]    [Environment]
        |               |               |               |
    - {factor}      - {factor}      - {factor}      - {factor}
    - {factor}      - {factor}      - {factor}      - {factor}
```

---

## 4. Detection & Response

### 4.1 Detection

| Aspect | Details |
|--------|---------|
| **How Detected** | Alert / Customer Report / Internal Discovery |
| **Detection Time** | {MINUTES} from incident start |
| **Detection Gap** | {WHAT_DELAYED_DETECTION} |

### 4.2 Response

| Aspect | Details |
|--------|---------|
| **Response Time** | {MINUTES} from detection |
| **Escalation Path** | {TEAMS_INVOLVED} |
| **Communication** | {CHANNELS_USED} |

---

## 5. Recommendations

### 5.1 Immediate Actions (< 1 week)

| # | Action | Owner | Due Date | Status |
|---|--------|-------|----------|--------|
| 1 | {ACTION} | {OWNER} | {DATE} | Open |
| 2 | {ACTION} | {OWNER} | {DATE} | Open |

### 5.2 Short-term Improvements (1-4 weeks)

| # | Action | Owner | Due Date | Status |
|---|--------|-------|----------|--------|
| 1 | {ACTION} | {OWNER} | {DATE} | Open |
| 2 | {ACTION} | {OWNER} | {DATE} | Open |

### 5.3 Long-term Improvements (> 4 weeks)

| # | Action | Owner | Due Date | Status |
|---|--------|-------|----------|--------|
| 1 | {ACTION} | {OWNER} | {DATE} | Open |
| 2 | {ACTION} | {OWNER} | {DATE} | Open |

---

## 6. Lessons Learned

### 6.1 What Went Well

- {POSITIVE_ASPECT_1}
- {POSITIVE_ASPECT_2}

### 6.2 What Could Be Improved

- {IMPROVEMENT_1}
- {IMPROVEMENT_2}

### 6.3 Knowledge Gaps Identified

- {GAP_1}
- {GAP_2}

---

## 7. Appendix

### 7.1 Related Artifacts

- Link to incident channel: {URL}
- Link to monitoring dashboards: {URL}
- Link to relevant logs: {URL}
- Link to related JIRA tickets: {URL}

### 7.2 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {DATE} | {AUTHOR} | Initial draft |

---

*This RCA follows the blameless postmortem principle. Focus on systems and processes, not individuals.*
