/* The parts of the knowledge base that are not already data in `lib/` —
   résumé detail, work authorization, and contact routing.

   Keep this file stable. It is the head of the prompt prefix that Gemini's
   implicit cache keys on, so an edit here costs the cache; that is a fine
   trade quarterly and a waste per deploy. */

export const PROFILE = `# Srinivasan Vijayaraghavan

Lead DevOps / Site Reliability Engineer — cloud infrastructure, reliability, and
release automation. Based in Bangalore, India.

- Site: https://www.srinidevops.com
- Email: srinivasan.shyam2000@gmail.com
- LinkedIn: https://www.linkedin.com/in/srini-solution-architect/
- GitHub: https://github.com/Srinivasan-78
- Résumé PDF: https://www.srinidevops.com/resume.pdf

## Work authorization

U.S. citizen and OCI holder — authorized to work in both the United States and
India, with no sponsorship required in either. Currently based in Bangalore and
open to opportunities.

## Summary

Five years owning release, upgrade, and disaster-recovery automation for a
multi-tenant Azure platform of 15+ microservices. Builds the pipelines, health
gates, and rollback paths that decide whether a release ships — and owns the
recovery when it doesn't.

## Experience

### DevOps Engineer — Thomson Reuters (Jun 2023 – present, Bangalore)

Owns release, upgrade, and disaster-recovery automation for a multi-tenant legal
platform across multiple Azure regions and environments.

Release engineering and upgrade automation:
- Replaced manual upgrade runbooks with unattended Ansible orchestration for 15+
  microservices, with per-service rescue blocks and automatic rollback.
- Gated deployments on backup integrity — T-SQL-verified transaction-log backups,
  RESTORE-based rollback, and Datadog failure hooks.
- Automated container image promotion across environments in GitHub Actions,
  streaming Azure DevOps build logs into the GitHub console.
- Built on-premises deployment automation from scratch: Jinja2 config templates,
  idempotent SQL Server initialization, and pre-flight input validation.

Reliability, disaster recovery, and observability:
- Extended DR failover and failback to modernized microservices, driving
  maintenance and active state transitions through Azure Service Bus.
- Migrated databases and application servers across Azure regions with zero data
  loss, covering restore, HA mirroring, and rollback.
- Hardened Apache restarts with a four-condition health gate: service state,
  HTTP 200, load-balancer convergence, and healthcheck file.
- Eliminated transient-fault pipeline failures with retry backoff (5 attempts,
  2s) and defensive checks for WinRM connectivity loss.
- Extended HTTP, TCP, and JMX health monitoring to every microservice, with
  dynamic template generation and dependency-aware agent restarts.
- Cut failed-deployment detection time by instrumenting release playbooks with
  deployment telemetry, run summaries, and Teams alerting.

Platform engineering, security, and cost:
- Refactored multi-environment Ansible inventories into an environment-agnostic
  model across 15+ microservices, removing a recurring three-place edit.
- Closed an unrestricted-execution gap with two RBAC gate workflows, and
  integrated BYOK via Key Vault and Azure App Configuration.
- Led a jumpbox VM family upgrade through ITSM change management to reduce
  compute spend across the estate.

Standout project on this team: a parallelized migration framework built on Azure
Storage, custom runners, delta detection, and AzCopy — speeding up large
transfers and cutting migration downtime.

### DevOps Engineer — GraniteRiverLabs (Sep 2021 – Jun 2023, Bangalore)

- Built Docker build, tag, push, and deploy pipelines, plus automated WiX
  installer signing and dpkg packaging in CI.
- Enforced linting, unit tests, and PR quality gates across GitHub repositories.
- Scoped AWS EC2 security groups and key-pair management to least privilege for
  a .NET application.
- Built Zigbee test automation for Project MATTER (Connectivity Standards
  Alliance) and a custom Windows Wireshark installer via GitLab CI. The
  Wireshark THREAD installer work is public as a merge request that the team
  later adopted:
  https://gitlab.com/wireshark/wireshark/-/merge_requests/11008

## Technical skills

- CI/CD and IaC: GitHub Actions, Azure DevOps (incl. REST API), GitLab CI,
  Ansible, Jinja2, Bicep, ARM templates, Terraform, Docker.
- Cloud: Azure — ACR, AKS, Service Bus, App Configuration, Key Vault (BYOK),
  Storage, Load Balancer, AzCopy, CLI. AWS — EC2, security groups.
- Reliability and SRE: DR failover/failback, SQL Server mirroring (HA), backup
  and restore verification, health-gated restarts, automated rollback, ITSM
  change management.
- Observability: Datadog, Pingdom, HTTP/TCP/JMX synthetic checks, deployment
  telemetry, Teams alerting.
- Platforms and data: Windows Server, RHEL/Ubuntu, Apache HTTPD, Tomcat, SQL
  Server (T-SQL, backup/restore, mirroring), Solr, WinRM, Akamai.
- Languages: Python, Bash/Shell, PowerShell/Batch, YAML, SQL, C/C++.
- Security: RBAC gates in CI, centralized secret management, BYOK encryption,
  S/MIME commit signing, vulnerability scanning.

## Education

B.E., Electronics and Communication — Madras Institute of Technology (MIT), Anna
University, Chennai, India. Graduated Aug 2021.

## How he works (from the site)

- Validate before you ship: backup integrity verified in T-SQL, four-condition
  health checks on restart, validation that fails fast rather than
  half-deploying.
- Rehearse the recovery: every upgrade path has a rescue block and a tested
  restore.
- Config without drift: environment-agnostic Ansible instead of a three-place
  edit.
- Failures announce themselves: deployment telemetry, run summaries, and Teams
  alerting.

## Site map

- / — home: intro, stats, selected work, capabilities.
- /projects — 14 project write-ups with architecture notes and links.
- /certifications — 24 verifiable credentials.
- /contact — email, LinkedIn, GitHub, and a contact form.
- /resume.pdf — downloadable résumé.
`;
