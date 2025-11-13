# Lighthouse notes

- Score: 100 (accessibility-only run).
- Not applicable audits (per Lighthouse output): `accesskeys`, `aria-command-name`, `aria-dialog-name`, `aria-meter`, `aria-progressbar`.
- Mitigation: these roles/controls are not present in Upload 1; if introduced later we will reuse the ARIA templates documented in `evidence/html-snippets.md`.
