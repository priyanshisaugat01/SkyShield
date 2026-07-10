# SkyShield

**Cloud-native DevSecOps compliance automation for aviation infrastructure.**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-foundation-lightgrey.svg)]()

---

## Project Overview

SkyShield is a DevSecOps compliance automation platform purpose-built for aviation infrastructure. It automates security and compliance validation of cloud infrastructure and container artifacts *before* deployment, replacing manual, error-prone review with continuous, auditable, automated scanning.

Aviation infrastructure operates under strict regulatory and safety requirements. SkyShield brings modern DevSecOps practices — infrastructure-as-code scanning, container vulnerability detection, secret detection, and automated compliance reporting — into that environment as a first-class part of the deployment pipeline, not an afterthought.

## Vision

To make security and compliance validation an invisible, automatic, non-negotiable gate in every deployment pipeline for aviation and other high-assurance infrastructure — so that non-compliant or vulnerable infrastructure simply cannot reach production.

## Problem Statement

Aviation and other critical infrastructure operators face a combination of challenges that make manual security review insufficient:

- Infrastructure-as-code (Terraform) is frequently deployed with misconfigurations that violate security best practices and regulatory requirements.
- Container images can carry known vulnerabilities that go undetected until after deployment.
- Secrets (API keys, credentials, tokens) are routinely committed to source control by accident.
- Compliance reporting is manual, inconsistent, and difficult to audit after the fact.
- There is no unified, real-time view of the compliance posture of infrastructure across an organization.

SkyShield addresses these gaps by automating detection and reporting at each stage of the deployment lifecycle.

## Goals

- Prevent non-compliant or insecure infrastructure from reaching production.
- Provide a single, auditable source of truth for compliance status.
- Integrate security scanning directly into existing CI/CD workflows with minimal friction.
- Surface actionable, prioritized findings rather than raw scanner noise.
- Build a platform that scales from a single project to organization-wide adoption.

## Planned Features

- **Infrastructure-as-Code scanning** — Terraform static analysis using Checkov.
- **Container image scanning** — vulnerability detection using Trivy.
- **Secret detection** — exposed credentials and tokens detected using GitLeaks.
- **Automated report processing** — scan output normalized and processed via AWS Lambda.
- **Persistent compliance history** — scan results stored in DynamoDB.
- **Operational metrics** — key indicators published to CloudWatch.
- **Alerting** — non-compliant findings trigger notifications via SNS.
- **Compliance dashboard** — a React-based UI for visualizing compliance posture and trends.
- **CI/CD automation** — the entire pipeline orchestrated through GitHub Actions.

## High-Level Architecture

> The architecture below describes the intended end-state. It is a planning reference for future development phases — no infrastructure, application, or pipeline code exists yet.

```
 ┌────────────────────┐
 │  Source Repository  │
 │  (Terraform, Code,  │
 │   Docker images)    │
 └──────────┬──────────┘
            │
            ▼
 ┌────────────────────────────────────────────┐
 │            GitHub Actions Pipeline           │
 │  ┌───────────┐ ┌────────┐ ┌──────────────┐  │
 │  │  Checkov  │ │ Trivy  │ │   GitLeaks   │  │
 │  │ (Terraform│ │ (Image │ │   (Secret    │  │
 │  │  scan)    │ │ scan)  │ │  detection)  │  │
 │  └─────┬─────┘ └───┬────┘ └──────┬───────┘  │
 └────────┼───────────┼─────────────┼──────────┘
          └───────────┴─────────────┘
                       │  scan reports
                       ▼
              ┌──────────────────┐
              │   AWS Lambda      │
              │ (report processor)│
              └────────┬──────────┘
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
  ┌────────────┐ ┌─────────────┐ ┌──────────┐
  │  DynamoDB   │ │ CloudWatch  │ │   SNS     │
  │  (results)  │ │  (metrics)  │ │ (alerts)  │
  └──────┬──────┘ └─────────────┘ └──────────┘
         │
         ▼
 ┌───────────────────────┐
 │   React Dashboard      │
 │ (compliance reporting) │
 └───────────────────────┘
```

## Technology Stack

| Layer                  | Technology              |
|------------------------|--------------------------|
| IaC Scanning           | Checkov                 |
| Container Scanning     | Trivy                   |
| Secret Detection       | GitLeaks                |
| Compute (report logic) | AWS Lambda              |
| Data Storage           | AWS DynamoDB             |
| Observability          | AWS CloudWatch          |
| Alerting               | AWS SNS                 |
| Frontend Dashboard     | React                   |
| CI/CD Orchestration    | GitHub Actions          |
| Infrastructure as Code | Terraform               |

## Development Roadmap

This roadmap sequences work by dependency, not by date — each phase produces something independently useful.

| Phase | Focus |
|-------|-------|
| **Day 1 — Foundation** *(complete)* | Repository structure, governance docs, licensing, contribution guidelines. |
| **Phase 2 — IaC Scanning** *(complete)* | Terraform project scaffold + Checkov integration. |
| **Phase 3 — Secure Infrastructure** *(current)* | Remediate the Phase 2 Checkov findings using AWS S3 security best practices. |
| **Phase 4 — Container Scanning** | Dockerized scan targets + Trivy integration. |
| **Phase 5 — Secret Detection** | GitLeaks integration across source and history. |
| **Phase 6 — Report Processing** | AWS Lambda functions to normalize and process scan output. |
| **Phase 7 — Storage & Observability** | DynamoDB persistence, CloudWatch metrics. |
| **Phase 8 — Alerting** | SNS-based notification on compliance violations. |
| **Phase 9 — Dashboard** | React compliance reporting UI. |
| **Phase 10 — CI/CD Automation** | End-to-end GitHub Actions pipeline tying all phases together. |

## Phase 2 – Infrastructure as Code Scanning

The first functional milestone: a real Terraform project and an automated Checkov gate that runs on every push and pull request.

- **`infra/terraform/`** — a minimal Terraform root module (`versions.tf`, `providers.tf`, `variables.tf`, `main.tf`, `outputs.tf`) configuring the AWS provider with pinned version constraints and default resource tagging.
- **One intentionally insecure resource** — a demo S3 bucket in `main.tf` deliberately configured with public access enabled (public access block disabled, public-read ACL). It exists solely as a scan target, clearly commented as intentional, so the pipeline has a real, known finding to catch.
- **`.github/workflows/checkov.yml`** — a GitHub Actions workflow that triggers on `push` and `pull_request`, installs Checkov, scans `infra/terraform`, and fails the build when security issues are found — proving the IaC security gate works end to end.

This phase intentionally excludes Docker, Trivy, GitLeaks, Lambda, DynamoDB, and dashboard code — those arrive in later phases per the roadmap above.

## Phase 3 – Secure Infrastructure

Remediates the Phase 2 demo S3 bucket using AWS security best practices, turning it from a deliberately-failing scan target into a reference example of a compliant bucket. Only `infra/terraform/main.tf`, `variables.tf`, and `outputs.tf` were changed — no other project files.

- **Private by default, ACLs disabled** — `aws_s3_bucket_ownership_controls` now sets `object_ownership = "BucketOwnerEnforced"`, which disables ACLs entirely so access is governed only by IAM/bucket policy.
- **Block Public Access fully enabled** — all four `aws_s3_bucket_public_access_block` settings (`block_public_acls`, `block_public_policy`, `ignore_public_acls`, `restrict_public_buckets`) are now `true`.
- **Server-side encryption enforced** — `aws_s3_bucket_server_side_encryption_configuration` applies AES256 encryption to every object by default.
- **Versioning enabled** — `aws_s3_bucket_versioning` is set to `Enabled`, protecting against accidental overwrite or deletion.

### Checkov findings: before vs. after

Scanned with Checkov 3.3.8 against `infra/terraform`.

| | Before (Phase 2) | After (Phase 3) |
|---|---|---|
| Passed | 6 | 12 |
| Failed | 13 | 5 |

**Fixed (8):**

| Check | Description |
|---|---|
| `CKV_AWS_20` | S3 bucket ACL allowed public read access |
| `CKV_AWS_53` | Block public ACLs not enabled |
| `CKV_AWS_54` | Block public policy not enabled |
| `CKV_AWS_55` | Ignore public ACLs not enabled |
| `CKV_AWS_56` | Restrict public buckets not enabled |
| `CKV_AWS_21` | Versioning not enabled |
| `CKV2_AWS_6` | No public access block attached to the bucket |
| `CKV2_AWS_65` | ACLs not disabled for the bucket |

**Remaining (5)** — out of scope for this milestone (logging, lifecycle, replication, and KMS are not in Phase 3's requirements):

| Check | Description |
|---|---|
| `CKV_AWS_18` | Access logging not enabled |
| `CKV_AWS_144` | Cross-region replication not enabled |
| `CKV_AWS_145` | Bucket not encrypted with KMS (this bucket uses AES256 by design; see comment in `main.tf`) |
| `CKV2_AWS_61` | No lifecycle configuration |
| `CKV2_AWS_62` | No event notifications configured |

## Repository Structure

```
SkyShield/
├── .github/
│   └── workflows/
│       └── checkov.yml        # Checkov IaC security scan (push / PR)
├── docs/
│   ├── architecture/          # Architecture diagrams and design records
│   └── screenshots/           # Dashboard and tooling screenshots
├── infra/
│   └── terraform/             # Terraform root module + Checkov scan target
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── CHANGELOG.md
└── .gitignore
```

Additional top-level directories (`services/`, `dashboard/`, issue templates, etc.) will be introduced in later phases, as their corresponding code is added — not created empty in advance.

## Future Scope

- Multi-cloud support beyond AWS (Azure, GCP).
- Policy-as-code customization for organization-specific compliance frameworks.
- Historical compliance trend analysis and predictive risk scoring.
- Role-based access control for the compliance dashboard.
- Integration with ticketing systems (e.g., Jira) for automated remediation tracking.

## License

SkyShield is licensed under the [Apache License 2.0](LICENSE).

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.
