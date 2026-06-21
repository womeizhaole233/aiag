# Task 1: Compress Dialogue Box Dimensions

## Task Description

Modify CSS in `templates/game.html` to compress the dialogue box height and update its background.

## Files

- Modify: `templates/game.html` (CSS within `{% block extra_css %}`)

## Steps

### Step 1: Update `.dialogue-body` padding and dimensions

Find the `.dialogue-body` rule and change these properties:

```css
/* BEFORE */
.dialogue-body {
    position: relative;
    background: rgba(8, 4, 2, 0.78);
    backdrop-filter: blur(8px);
    border-top: 3px solid #c99d57;
    border-bottom: 2px solid #5a3a14;
    box-shadow: 0 -10px 36px rgba(0,0,0,0.6);
    padding: 26px 56px 22px 56px;
    pointer-events: auto;
}

/* AFTER */
.dialogue-body {
    position: relative;
    background: rgba(30, 18, 8, 0.82);
    backdrop-filter: blur(4px);
    border-top: 2px solid #c99d57;
    border-bottom: 1px solid #5a3a14;
    box-shadow: 0 -4px 16px rgba(0,0,0,0.4);
    padding: 14px 40px 12px 40px;
    border-radius: 4px 4px 0 0;
    pointer-events: auto;
}
```

### Step 2: Update `.dialogue-text` min-height and max-height

Find the `.dialogue-text` rule and change:

```css
/* BEFORE */
.dialogue-text {
    font-size: 22px; line-height: 1.75;
    color: #f5ecd8;
    min-height: 110px;
    max-height: 26vh;
    overflow-y: auto;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
    letter-spacing: 1px;
}

/* AFTER */
.dialogue-text {
    font-size: 20px; line-height: 1.65;
    color: #f5ecd8;
    min-height: 44px;
    max-height: 12vh;
    overflow-y: auto;
    scrollbar-width: thin;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
    letter-spacing: 1px;
}
```

### Step 3: Commit

```bash
git add templates/game.html
git commit -m "style: compress dialogue box dimensions and update background texture"
```

## Global Constraints

- Only modify CSS within `{% block extra_css %}`
- Do NOT change HTML structure
- Do NOT change JavaScript logic
- Do NOT change the hexagon nameplate design
- Font family must remain `"STKaiti", "KaiTi", serif`
