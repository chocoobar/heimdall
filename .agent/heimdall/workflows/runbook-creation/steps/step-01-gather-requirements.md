---
name: 'step-01-gather-requirements'
description: 'Collect runbook requirements and context'
workflow_path: 'workflows/runbook-creation'
thisStepFile: './step-01-gather-requirements.md'
nextStepFile: './step-02-generate-runbook.md'
---

# Step 1: Gather Requirements

**Goal:** Collect specific requirements for the runbook based on its type and service.

---

## STATE VARIABLES

Capture and persist:
- `{runbook_type}` - Type of runbook (deployment, rollback, incident, etc.)
- `{service_name}` - Name of the service
- `{requirements}` - Structured dictionary of requirements
- `{author_name}` - User creating the runbook

---

## EXECUTION SEQUENCE

### 1. Basic Information

If `{runbook_type}` or `{service_name}` not provided in input:

```
🛡️ Runbook Creation.

Service Name: {service_name or prompt}

Runbook Type:
[1] Deployment
[2] Rollback
[3] Incident Response
[4] Maintenance
[5] Capacity/Scaling
[6] Custom
```

**WAIT for user input.**

---

### 2. Detailed Requirements

Based on `{runbook_type}`, gather specific context:

#### Deployment
```
Provide deployment details:
1. Deployment Method (k8s/helm/tf):
2. Pre-deployment checks:
3. Deployment commands:
4. Verification steps:
```

#### Rollback
```
Provide rollback details:
1. Triggers (when to rollback):
2. Rollback commands:
3. Data consistency checks:
4. Communication requirements:
```

#### Incident Response
```
Provide incident details:
1. Triggering alerts:
2. Severity levels:
3. Triage steps:
4. Common failure modes:
5. Mitigation steps:
```

#### Maintenance
```
Provide maintenance details:
1. Maintenance window/duration:
2. Impact (downtime vs degradation):
3. Procedure steps:
4. Verification:
```

**WAIT for user input.**

Store responses in `{requirements}`.

---

### 3. Escalation Contacts

```
🛡️ Escalation Path.

Who gets paged if this fails?
- Primary:
- Secondary:
- Manager:
```

**WAIT for user input.**

---

## VALIDATION

Confirm minimum data:
- [ ] Service name defined
- [ ] Runbook type defined
- [ ] Key procedure steps provided
- [ ] Escalation contact provided

---

## NEXT STEP

Read fully and follow: `step-02-generate-runbook.md`
