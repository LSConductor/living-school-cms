# Primary K–4 Belonging · curriculum page pack

Static reference for the Living School public site (WordPress / Bricks), parallel to [Middle School Catalyst](https://living.school/middle-school-catalyst-program/) and [Living Academy](https://living.academy/).

| File | Use |
| --- | --- |
| `index.html` + `primary.css` | Full Primary curriculum page — local preview or Bricks HTML paste |
| `photos/` | Web-optimised Primary photographs (upload to WP Media Library before Bricks) |
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

## Image map

| File | Role on page |
| --- | --- |
| `classroom-wondering.jpg` | **Hero** (full-bleed) |
| `classroom-mentors.jpg` | Classroom literacy / inquiry |
| `stage-performance.jpg` | Performing arts |
| `lake-excursion.jpg` | Outdoors / Thriver expedition |
| `surf-lesson.jpg` | Beach / PDHPE |
| `sand-collaboration.jpg` | Beach collaboration |
| `garden-foraging.jpg` | Kitchen Garden / farm |
| `mantis-discovery.jpg` | Phenomena / noticing |
| `garlic-harvest.jpg` | Harvest |
| `welcome-produce.jpg` | Garden produce |

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

## WP Media Library (John)

Upload every file in `photos/` to living.school Media Library, then swap `src="photos/…"` paths in Bricks to the Media URLs. Keep filenames for easy matching.

Publish steps: project store `docs/primary-k4-prospectus-curriculum.md`.
