---
name: 'runbook-creation-steps'
description: 'Combined runbook creation workflow steps'
---

# Runbook Creation Workflow

## Step 1: Gather Requirements

```
🛡️ Runbook Creation.

Runbook type:
[1] Deployment
[2] Rollback
[3] Incident Response
[4] Maintenance
[5] Capacity/Scaling
[6] Custom

Service name: _______
```

**WAIT for user input.**

For each type, gather specific information:

**Deployment:**
- Deployment method (k8s, helm, terraform)
- Pre-deployment checks
- Deployment commands
- Post-deployment verification

**Rollback:**
- Rollback triggers (when to rollback)
- Rollback commands
- Verification after rollback

**Incident Response:**
- Alert triggers
- Triage steps
- Common failure modes
- Escalation paths

**Maintenance:**
- Scheduled window
- Impact description
- Maintenance procedure
- Verification steps

---

## Step 2: Generate Runbook

Load template from `_bmad/sre/templates/runbook-template.md`.

Populate sections:

1. **Document Information**
   - ID, version, author, owner

2. **Overview**
   - Purpose, scope, when to use, expected outcome

3. **Prerequisites**
   - Required access, tools, knowledge, pre-checks

4. **Procedure**
   - Step-by-step with commands and expected outputs

5. **Rollback**
   - When to rollback, rollback steps, verification

6. **Verification**
   - Success criteria, verification commands

7. **Troubleshooting**
   - Common issues and resolutions

8. **Escalation**
   - When to escalate, contacts

---

## Step 3: Validate and Publish

**Validation checklist:**
- [ ] All sections complete
- [ ] Commands are testable
- [ ] Expected outputs documented
- [ ] Rollback procedure included
- [ ] Escalation contacts listed

Save to `{sre_artifacts}/runbooks/{service}-{type}-{date}.md`.

If Confluence available, offer to publish.

```
🛡️ Runbook complete.

{service}. {type}. {section_count} sections.
Path: {output_path}

Validation: {PASS/ISSUES}
```
