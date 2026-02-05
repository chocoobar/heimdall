# CI/CD Reliability Checklist

## Overview

This knowledge fragment provides comprehensive checklists for evaluating and improving CI/CD pipeline reliability. Use these checklists to assess pipeline health, identify improvements, and ensure consistent quality gates.

---

## 1. Pipeline Health Assessment

### Build Stability Metrics

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| Build Success Rate | >95% | 85-95% | <85% |
| Flaky Test Rate | <2% | 2-10% | >10% |
| Mean Build Time | <10min | 10-30min | >30min |
| Queue Wait Time | <5min | 5-15min | >15min |
| Build Frequency | >10/day | 5-10/day | <5/day |

### Health Score Calculation

```
Pipeline Health Score = 
  (Build Success Rate × 0.3) +
  ((100 - Flaky Test Rate) × 0.2) +
  (Time Score × 0.2) +
  (Deployment Frequency Score × 0.15) +
  (Recovery Time Score × 0.15)
```

---

## 2. Pipeline Reliability Checklist

### A. Source Control Integration

- [ ] **Branch Protection**
  - [ ] Main branch protected
  - [ ] Required status checks before merge
  - [ ] Required code review approval
  - [ ] No force pushes to protected branches

- [ ] **Commit Hygiene**
  - [ ] Commit messages follow convention
  - [ ] Atomic commits (single purpose)
  - [ ] Signed commits (if required)

- [ ] **Branch Strategy**
  - [ ] Clear branch naming convention
  - [ ] Short-lived feature branches (<1 week)
  - [ ] Regular trunk merges

### B. Build Phase

- [ ] **Build Reproducibility**
  - [ ] Deterministic builds (same input = same output)
  - [ ] Version-pinned dependencies
  - [ ] Build environment versioned
  - [ ] No reliance on external state during build

- [ ] **Build Performance**
  - [ ] Incremental builds enabled
  - [ ] Build caching configured
  - [ ] Parallel builds where possible
  - [ ] Build logs preserved (30+ days)

- [ ] **Artifact Management**
  - [ ] Artifacts versioned with git SHA
  - [ ] Artifact integrity verification (checksums)
  - [ ] Artifact retention policy defined
  - [ ] Signed artifacts (if required)

### C. Test Phase

- [ ] **Test Coverage**
  - [ ] Unit tests: >80% code coverage
  - [ ] Integration tests: critical paths covered
  - [ ] E2E tests: key user journeys
  - [ ] Contract tests: API boundaries

- [ ] **Test Quality**
  - [ ] Tests are deterministic (no flakes)
  - [ ] Tests are independent (no order dependency)
  - [ ] Tests are fast (fail fast)
  - [ ] Tests have clear assertions

- [ ] **Test Organization**
  - [ ] Test parallelization enabled
  - [ ] Test sharding for large suites
  - [ ] Flaky test quarantine system
  - [ ] Test result reporting

- [ ] **Test Data Management**
  - [ ] Test fixtures are repeatable
  - [ ] Test databases are isolated
  - [ ] Sensitive data is masked/synthetic
  - [ ] Cleanup after tests

### D. Security Scanning

- [ ] **Static Analysis (SAST)**
  - [ ] Code quality linting
  - [ ] Security vulnerability scanning
  - [ ] License compliance checking
  - [ ] Secret detection

- [ ] **Dependency Scanning**
  - [ ] Known vulnerability detection (CVE)
  - [ ] Outdated dependency alerts
  - [ ] License scanning
  - [ ] SBOM generation

- [ ] **Container Security**
  - [ ] Base image vulnerability scanning
  - [ ] Dockerfile best practices check
  - [ ] Container policy enforcement
  - [ ] Image signature verification

### E. Deployment Phase

- [ ] **Deployment Strategy**
  - [ ] Blue-green or canary deployments
  - [ ] Automated rollback capability
  - [ ] Feature flags for gradual rollout
  - [ ] Database migration strategy

- [ ] **Configuration Management**
  - [ ] Environment-specific configs separated
  - [ ] Secrets managed securely (vault, KMS)
  - [ ] Config validation before deploy
  - [ ] Config drift detection

- [ ] **Deployment Verification**
  - [ ] Health check endpoints
  - [ ] Smoke tests post-deploy
  - [ ] Metric-based deployment validation
  - [ ] Automated rollback triggers

### F. Monitoring & Observability

- [ ] **Pipeline Observability**
  - [ ] Build/deploy metrics collected
  - [ ] Pipeline dashboards available
  - [ ] Alerting on pipeline failures
  - [ ] Trend analysis over time

- [ ] **Deployment Observability**
  - [ ] Deployment markers in monitoring
  - [ ] Error rate tracking post-deploy
  - [ ] Latency tracking post-deploy
  - [ ] User-facing metric tracking

---

## 3. Recommended Pipeline Structure

### Stages

```yaml
stages:
  - lint          # Code quality (< 2 min)
  - build         # Compile/package (< 5 min)
  - test-unit     # Unit tests (< 5 min)
  - security      # Security scans (< 5 min)
  - test-int      # Integration tests (< 10 min)
  - build-image   # Container image (< 5 min)
  - deploy-dev    # Dev environment
  - test-e2e      # E2E tests (< 15 min)
  - deploy-stage  # Staging environment
  - test-perf     # Performance tests (optional)
  - deploy-prod   # Production (manual gate)
```

### Stage Requirements

| Stage | Max Duration | Failure Action | Skip Condition |
|-------|--------------|----------------|----------------|
| lint | 2 min | Fail fast | Never |
| build | 5 min | Fail fast | Never |
| test-unit | 5 min | Fail fast | Never |
| security | 5 min | Fail (block critical) | Never |
| test-int | 10 min | Fail fast | Never |
| build-image | 5 min | Fail fast | Never |
| deploy-dev | 5 min | Retry then fail | Manual trigger |
| test-e2e | 15 min | Fail fast | docs-only changes |
| deploy-stage | 5 min | Retry then fail | Manual trigger |
| deploy-prod | 10 min | Halt for approval | Manual trigger |

---

## 4. Common Pipeline Issues

### Issue: Flaky Tests

**Symptoms:**
- Same test sometimes passes, sometimes fails
- Tests pass locally but fail in CI
- Parallel test failures

**Root Causes:**
- Shared test state
- Time-dependent tests
- Race conditions
- External service dependencies

**Solutions:**
```yaml
# Quarantine flaky tests
test-unit:
  script:
    - npm test -- --exclude @flaky
  
test-flaky:
  script:
    - npm test -- --include @flaky
  allow_failure: true
  when: manual
```

### Issue: Slow Builds

**Symptoms:**
- Build times >30 minutes
- Developer productivity reduced
- Queue buildup during peak hours

**Solutions:**
```yaml
# Enable caching
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .npm/

# Parallelize tests
test:
  parallel: 4
  script:
    - npm test -- --shard=${CI_NODE_INDEX}/${CI_NODE_TOTAL}
```

### Issue: Environment Drift

**Symptoms:**
- Works in dev but fails in staging/prod
- Configuration mismatches
- Different dependency versions

**Solutions:**
```yaml
# Use identical containers across environments
deploy:
  image: ${IMAGE_REGISTRY}/${IMAGE_NAME}:${CI_COMMIT_SHA}
  
# Version pin all dependencies
FROM node:18.19.0-alpine3.19

# Infrastructure as Code for environments
terraform:
  script:
    - terraform plan -var-file=${ENV}.tfvars
```

### Issue: Secret Leakage

**Symptoms:**
- Secrets visible in logs
- Credentials in code
- Unprotected secret storage

**Solutions:**
```yaml
# Mask secrets in CI
variables:
  DATABASE_PASSWORD:
    value: $CI_DATABASE_PASSWORD
    masked: true

# Use external secret management
script:
  - vault read -field=password secret/database > /dev/null
```

---

## 5. DORA Metrics Tracking

### Key Metrics

| Metric | Definition | Elite | High | Medium | Low |
|--------|------------|-------|------|--------|-----|
| **Deployment Frequency** | How often you deploy | On-demand (daily+) | Weekly-monthly | Monthly-6 monthly | <6 monthly |
| **Lead Time for Changes** | Commit to production | <1 hour | 1 day - 1 week | 1-6 months | >6 months |
| **Change Failure Rate** | % of deployments causing failures | 0-15% | 16-30% | 31-45% | >45% |
| **MTTR** | Time to recover from failures | <1 hour | <1 day | 1 day - 1 week | >1 week |

### Measurement Queries

```promql
# Deployment Frequency (per day)
count_over_time(
  deployment_events_total[30d]
) / 30

# Change Failure Rate
sum(deployment_events_total{result="failure"}[30d])
  /
sum(deployment_events_total[30d])

# Lead Time (requires custom instrumentation)
# Track: commit time → deploy time

# MTTR
avg(incident_duration_seconds{severity=~"p1|p2"})
```

---

## 6. Pipeline Security Hardening

### Access Control

```yaml
# Restrict who can deploy to production
deploy-prod:
  only:
    - main
  when: manual
  allow_failure: false
  rules:
    - if: $CI_COMMIT_REF_NAME == "main"
      when: manual
      allow_failure: false

# Require approval
deploy-prod:
  needs:
    - job: security-scan
      artifacts: true
  rules:
    - if: $SECURITY_SCAN_STATUS == "PASS"
```

### Artifact Integrity

```yaml
# Sign container images
build-image:
  script:
    - docker build -t ${IMAGE} .
    - cosign sign ${IMAGE}

# Verify before deploy
deploy:
  script:
    - cosign verify ${IMAGE}
    - kubectl set image deployment/${APP} ${CONTAINER}=${IMAGE}
```

### Secret Rotation

```yaml
# Rotate secrets in CI
.rotate-secrets:
  script:
    - vault write auth/jwt/login role=ci jwt=$CI_JOB_JWT
    - vault read secret/app/${ENV}/database
  only:
    - schedules
```

---

## 7. Continuous Improvement Checklist

### Monthly Review

- [ ] Review build success rate trends
- [ ] Identify and fix top flaky tests
- [ ] Review build time trends
- [ ] Check security scan findings
- [ ] Update dependencies

### Quarterly Review

- [ ] Review DORA metrics
- [ ] Pipeline architecture assessment
- [ ] Tool/runner upgrades
- [ ] Cost optimization
- [ ] Security policy updates

### Incident-Driven

After any pipeline-related incident:
- [ ] Document what failed
- [ ] Identify missing checks
- [ ] Add prevention measures
- [ ] Update runbooks
- [ ] Share learnings

---

## 8. Quick Reference: Pipeline Commands

### GitHub Actions

```yaml
# Cancel redundant runs
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# Required status checks
on:
  pull_request:
    branches: [main]

# Manual deployment
deploy-prod:
  environment: production
  needs: [test, security]
  if: github.event_name == 'workflow_dispatch'
```

### GitLab CI

```yaml
# Interruptible jobs (cancel on new commits)
job:
  interruptible: true

# Manual approval
deploy-prod:
  when: manual
  environment:
    name: production
    action: start
```

### Jenkins

```groovy
// Pipeline approval
stage('Deploy to Prod') {
    input {
        message "Deploy to production?"
        ok "Deploy"
        submitter "admin,release-team"
    }
    steps {
        sh 'deploy.sh'
    }
}
```

---

*Last updated: 2026-02-04*
*Applies to: GitHub Actions, GitLab CI, Jenkins, CircleCI*
