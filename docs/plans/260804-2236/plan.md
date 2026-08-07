---
title: "GuAI Studio Website Implementation Plan"
description: "Implementation plan for GuAI Studio website using Astro, Strapi, and GitHub Actions."
status: pending
priority: P2
effort: 32h
issue: 
branch: main
tags: [frontend, backend, infra, cms, astro]
blockedBy: []
blocks: []
created: 2026-08-04
---

# GuAI Studio Website Implementation Plan

## Overview

Build a multi-page company profile and portfolio website for GuAI Studio using an Astro frontend, Strapi CMS with PostgreSQL database, and automated deployments via GitHub Actions. The infrastructure will be hosted on a budget-friendly VPS with Cloudflare DNS and R2 object storage.

## Cross-Plan Dependencies

| Relationship | Plan | Status |
|-------------|------|--------|
| Brainstorm | [brainstorm-summary.md](./brainstorm-summary.md) | completed |
| Solution Design | [solution-design.md](./solution-design.md) | draft |

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Setup Infrastructure](./phase-01-setup-infra.md) | Completed |
| 2 | [Strapi Content Model & i18n](./phase-02-strapi-content-model.md) | Completed |
| 3 | [Design System](./phase-03-design-system.md) | Completed |
| 4 | [Astro Pages & SEO](./phase-04-astro-pages.md) | Completed |
| 5 | [Contact Form & Lead Pipeline](./phase-05-contact-lead-pipeline.md) | Pending |
| 6 | [CI/CD Pipeline](./phase-06-ci-cd-pipeline.md) | Pending |
| 7 | [Handover & Go-live](./phase-07-handover-go-live.md) | Pending |

## Dependencies
- VPS Provisioned and SSH accessible
- Domain name configured with Cloudflare
- Resend / Brevo API keys
- Cloudflare Turnstile Site Key & Secret
- Cloudflare R2 API Credentials
- GitHub Repo and SSH Deploy Key
