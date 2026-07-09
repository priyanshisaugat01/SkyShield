# Contributing to SkyShield

Thank you for your interest in contributing to SkyShield. This document describes how to propose changes and what to expect from the review process.

## Ground Rules

- Be respectful and constructive. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- Open an issue before starting significant work, so design direction can be agreed on first.
- Keep pull requests focused — one logical change per PR.

## Getting Started

1. Fork the repository and clone your fork.
2. Create a feature branch from `main`:
   ```
   git checkout -b feature/short-description
   ```
3. Make your changes.
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/) style, e.g.:
   - `feat: add Checkov scan step`
   - `fix: correct DynamoDB table name`
   - `docs: update architecture diagram`
5. Push your branch and open a pull request against `main`.

## Pull Request Guidelines

- Describe *what* changed and *why* in the PR description.
- Reference any related issue (`Closes #12`).
- Ensure the PR is scoped to a single concern.
- Be prepared to respond to review feedback — PRs are merged once approved by a maintainer.

## Reporting Bugs

Open a GitHub issue with:
- A clear title and description.
- Steps to reproduce, if applicable.
- Expected vs. actual behavior.

## Reporting Security Issues

Do **not** open a public issue for security vulnerabilities. See [SECURITY.md](SECURITY.md) for the disclosure process.

## Questions

If anything is unclear, open a GitHub issue with the `question` label.
