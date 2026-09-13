import json
from datetime import datetime, timezone
from pathlib import Path


def load_json(path, default):
    file = Path(path)

    if not file.exists():
        return default

    try:
        return json.loads(file.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return default


# -------------------------
# Checkov
# -------------------------
checkov = load_json("checkov-results.json", {})
checkov_summary = checkov.get("summary", {})

checkov_passed = int(checkov_summary.get("passed", 0) or 0)
checkov_failed = int(checkov_summary.get("failed", 0) or 0)
checkov_skipped = int(checkov_summary.get("skipped", 0) or 0)

checkov_total = checkov_passed + checkov_failed

compliance_score = (
    round((checkov_passed / checkov_total) * 100, 1)
    if checkov_total
    else 0
)


# -------------------------
# GitLeaks
# -------------------------
gitleaks = load_json("gitleaks-results.json", [])

if isinstance(gitleaks, list):
    secrets_detected = len(gitleaks)
elif isinstance(gitleaks, dict):
    secrets_detected = len(gitleaks.get("findings", []))
else:
    secrets_detected = 0


# -------------------------
# Trivy
# -------------------------
trivy = load_json("trivy-results.json", {})

severity_counts = {
    "CRITICAL": 0,
    "HIGH": 0,
    "MEDIUM": 0,
    "LOW": 0,
    "UNKNOWN": 0,
}

vulnerabilities = []

for result in trivy.get("Results", []):
    for vulnerability in result.get("Vulnerabilities", []) or []:

        severity = str(
            vulnerability.get("Severity", "UNKNOWN")
        ).upper()

        severity_counts[severity] = (
            severity_counts.get(severity, 0) + 1
        )

        vulnerabilities.append({
            "id": vulnerability.get("VulnerabilityID"),
            "package": vulnerability.get("PkgName"),
            "installed_version": vulnerability.get("InstalledVersion"),
            "fixed_version": vulnerability.get("FixedVersion"),
            "severity": severity,
            "title": vulnerability.get("Title"),
        })


trivy_total = sum(severity_counts.values())


# -------------------------
# Final Security Summary
# -------------------------
summary = {
    "project": "SkyShield",

    "generated_at": datetime.now(
        timezone.utc
    ).isoformat(),

    "checkov": {
        "passed": checkov_passed,
        "failed": checkov_failed,
        "skipped": checkov_skipped,
        "total_checks": checkov_total,
        "compliance_score": compliance_score,
        "resource_count": checkov_summary.get(
            "resource_count", 0
        ),
        "version": checkov_summary.get(
            "checkov_version"
        ),
    },

    "gitleaks": {
        "secrets_detected": secrets_detected,
    },

    "trivy": {
        "critical": severity_counts["CRITICAL"],
        "high": severity_counts["HIGH"],
        "medium": severity_counts["MEDIUM"],
        "low": severity_counts["LOW"],
        "unknown": severity_counts["UNKNOWN"],
        "total_vulnerabilities": trivy_total,
        "vulnerabilities": vulnerabilities,
    },

    "totals": {
        "findings": (
            checkov_failed
            + secrets_detected
            + trivy_total
        ),
    },
}


Path("security-summary.json").write_text(
    json.dumps(summary, indent=2),
    encoding="utf-8",
)

print(json.dumps(summary, indent=2))