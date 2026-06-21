# Task 4: Update Mobile Responsive Styles

## Task Description

Modify CSS in `templates/game.html` to update the mobile responsive styles for the compact dialogue box design.

## Files

- Modify: `templates/game.html` (CSS within `{% block extra_css %}`)

## Steps

### Step 1: Update mobile media query

Find the `@media (max-width: 768px)` block for dialogue (should be around line 258-265 area) and replace:

```css
/* BEFORE */
@media (max-width: 768px) {
    .dialogue-body { padding: 22px 22px 18px 22px; }
    .dialogue-header { left: 18px; top: -24px; }
    .hexagon-nameplate { min-width: 140px; height: 36px; padding: 0 20px; }
    .hexagon-nameplate span { font-size: 14px; letter-spacing: 2px; }
    .dialogue-text { font-size: 16px; max-height: 40vh; }
    .choice-btn { font-size: 14px; padding: 10px 16px; }
}

/* AFTER */
@media (max-width: 768px) {
    .dialogue-body { padding: 12px 16px 10px 16px; }
    .dialogue-header { left: 14px; top: -20px; }
    .hexagon-nameplate { min-width: 120px; height: 32px; padding: 0 16px; }
    .hexagon-nameplate span { font-size: 14px; letter-spacing: 2px; }
    .dialogue-text { font-size: 15px; max-height: 20vh; }
    .choice-btn { font-size: 13px; padding: 8px 14px; }
}
```

### Step 2: Commit

```bash
git add templates/game.html
git commit -m "style: update mobile responsive styles for compact dialogue"
```

## Global Constraints

- Only modify CSS within `{% block extra_css %}`
- Do NOT change HTML structure
- Do NOT change JavaScript logic
- Do NOT change the hexagon nameplate design
- Font family must remain `"STKaiti", "KaiTi", serif`
- Preserve the existing `@media (max-width: 768px)` breakpoint — only update values inside it
