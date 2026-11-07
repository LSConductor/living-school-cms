# Primary K–4 Belonging · curriculum page pack

Static reference for the Living School public site (WordPress / Bricks), parallel to [Middle School Catalyst](https://living.school/middle-school-catalyst-program/) and [Living Academy](https://living.academy/).

| File | Use |
| --- | --- |
| `bricks-drop-in.html` | **Paste this into Bricks** — inline CSS + live Media Library `src`s |
| `index.html` + `primary.css` | Same page with absolute Media URLs (local preview / reference) |
| `photos/` | Web-optimised copies (optional; live site uses Media Library URLs) |
| `homepage-primary-card.html` | Homepage “Three campuses” Primary card with program + prospectus CTAs |

## Brand alignment (vs Middle School)

Matched to `middle-school-catalyst-program` computed tokens:

- **Serif:** Fraunces, Georgia
- **Sans:** system UI stack
- **Hero:** sage overlay `#4b5d52` / `#3a4a41` over full-bleed photo
- **Sections:** white / cream `#f6f1e9`
- **Kickers:** terracotta `#9a5a3c` and navy `#2c3e50`
- **CTAs:** white solid pill + white outlined ghost (hero), matching MS button language

Earlier portal-teal draft was replaced — it did not match living.school marketing pages.

## Image map (live Media Library)

| Role | Live URL |
| --- | --- |
| Hero | `…/2026/11/classroom_wondering.jpg` |
| Mentors | `…/2026/11/classroom_mentors.jpg` |
| Stage | `…/2026/11/stage_performance.jpg` |
| Outdoors · Flatrock | `…/2026/11/Flatrock-platform_students.jpg` |
| Lake | `…/2026/11/IMG_6775.jpeg` |
| Surf / sand | `…/2026/11/surf_lesson.jpg` · `sand_collaboration.jpg` |
| Garden foraging | `…/2023/11/0ADE6952-476F-4DB5-BFAC-B8EEE34C80C3.jpg` |
| Mantis / harvest | `…/2026/11/GardenImage.jpg` · `JabayGardenBounty-scaled.jpg` · `JabayKitchenGardenProduce.jpg` |

## URLs

| Role | URL |
| --- | --- |
| Proposed page slug | `https://living.school/primary-k4-belonging-program/` |
| Prospectus PDF | `https://living.school/wp-content/uploads/2026/Prospectus/2026.primary-k4-curriculum.pdf` |

## Local preview

```bash
cd primary-k4
python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/
```

## Bricks paste

Use `bricks-drop-in.html` (also mirrored in Project store `docs/uploads/primary-k4-prospectus-curriculum/`). All `src`s are live. See `docs/primary-k4-prospectus-curriculum.md`.
