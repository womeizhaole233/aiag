# Task 2 Report: Redesign Choice Buttons to Bookmark Style

## What I Implemented

Replaced the capsule/pill-shaped choice buttons with a bookmark/scroll style using a gold left accent line. Changes are CSS-only within `{% block extra_css %}`.

### Changes Made

1. **`.choices-area`** — Reduced gap from 10px to 8px, margin-top from 14px to 10px, removed auto margins (changed to `max-width: 100%`).
2. **`.choice-btn`** — Changed from capsule style (border-radius: 26px, thick border) to bookmark style (border-radius: 0 4px 4px 0, 3px gold left accent). Updated background to `rgba(45, 28, 12, 0.7)`, reduced padding and font-size slightly.
3. **`.choice-btn:hover/.choice-btn.focused`** — Added gold left border thickening (3px → 4px), added left glow `box-shadow: -2px 0 8px rgba(201, 157, 87, 0.4)`.

## Files Changed

- `baisha_chenyan/templates/game.html` — CSS only (lines 144–170)

## Self-Review Findings

- No issues found. All three steps from the brief were applied exactly.
- No HTML or JavaScript was modified.
- Font family remains `"STKaiti", "KaiTi", serif`.
- Hexagon nameplate design untouched.
- Responsive media query at line 256 (`@media (max-width: 768px)`) still applies correctly to `.choice-btn`.

## Commits

- `1f9201b` — style: redesign choice buttons to bookmark/scroll style
