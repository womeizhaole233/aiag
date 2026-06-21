# Task 3: Add Paper Texture and Refine Gold Line

## Task Description

Modify CSS in `templates/game.html` to add a subtle paper texture overlay and thin the gold accent line on the dialogue box.

## Files

- Modify: `templates/game.html` (CSS within `{% block extra_css %}`)

## Steps

### Step 1: Update the gold line pseudo-element

Find the `.dialogue-body::before` rule and change:

```css
/* BEFORE */
.dialogue-body::before {
    content: "";
    position: absolute;
    left: 0; right: 0; top: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent 0%, #c99d57 18%, #f5ecd8 50%, #c99d57 82%, transparent 100%);
}

/* AFTER */
.dialogue-body::before {
    content: "";
    position: absolute;
    left: 0; right: 0; top: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #c99d57 18%, #f5ecd8 50%, #c99d57 82%, transparent 100%);
}
```

### Step 2: Add paper texture via new pseudo-element

After the `.dialogue-body::before` block, add a new rule for paper texture:

```css
.dialogue-body::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
    pointer-events: none;
    border-radius: 4px 4px 0 0;
}
```

### Step 3: Commit

```bash
git add templates/game.html
git commit -m "style: add paper texture overlay and thin gold accent line"
```

## Global Constraints

- Only modify CSS within `{% block extra_css %}`
- Do NOT change HTML structure
- Do NOT change JavaScript logic
- Do NOT change the hexagon nameplate design
- Font family must remain `"STKaiti", "KaiTi", serif`
