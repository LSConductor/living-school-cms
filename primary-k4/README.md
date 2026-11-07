# Primary K–4 Belonging · curriculum page pack

Static reference for the Living School public site (WordPress / Bricks), parallel to [Middle School Catalyst](https://living.school/middle-school-catalyst-program/) and [Living Academy](https://living.academy/).

| File | Use |
| --- | --- |
| `index.html` + `primary.css` | Full Primary curriculum page — local preview or Bricks HTML paste |
| `homepage-primary-card.html` | Homepage “Three campuses” Primary card with program + prospectus CTAs |

## URLs

| Role | URL |
| --- | --- |
| Proposed page slug | `https://living.school/primary-k4-belonging-program/` |
| Prospectus PDF (site + enrolment emails) | `https://living.school/wp-content/uploads/2026/Prospectus/2026.primary-k4-curriculum.pdf` |

## Local preview

```bash
cd primary-k4
python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/
```

## Source of truth

Page copy is grounded only in:

- Primary K–4 prospectus PDF (2026)
- Homepage campus lines
- [K–13 Learning & Thinking Continuum](https://living.school/learning-and-thinking-continuum/)

No portal teacher or student academic data.

Publish steps for John: project store `docs/primary-k4-prospectus-curriculum.md`.
