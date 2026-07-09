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
| **Day 1 — Foundation** *(current)* | Repository structure, governance docs, licensing, contribution guidelines. |
| **Phase 2 — IaC Scanning** | Terraform project scaffold + Checkov integration. |
| **Phase 3 — Container Scanning** | Dockerized scan targets + Trivy integration. |
| **Phase 4 — Secret Detection** | GitLeaks integration across source and history. |
| **Phase 5 — Report Processing** | AWS Lambda functions to normalize and process scan output. |
| **Phase 6 — Storage & Observability** | DynamoDB persistence, CloudWatch metrics. |
| **Phase 7 — Alerting** | SNS-based notification on compliance violations. |
| **Phase 8 — Dashboard** | React compliance reporting UI. |
| **Phase 9 — CI/CD Automation** | End-to-end GitHub Actions pipeline tying all phases together. |

## Repository Structure

```
SkyShield/
├── docs/
│   ├── architecture/          # Architecture diagrams and design records
│   └── screenshots/           # Dashboard and tooling screenshots
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── CHANGELOG.md
└── .gitignore
```

Additional top-level directories and files (`infra/`, `services/`, `dashboard/`, `.github/workflows/`, issue templates, etc.) will be introduced in later phases, as their corresponding code is added — not created empty in advance.

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
