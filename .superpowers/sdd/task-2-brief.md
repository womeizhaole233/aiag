# Task 2: Redesign Choice Buttons to Bookmark Style

## Task Description

Modify CSS in `templates/game.html` to change choice buttons from capsule style to bookmark/scroll style with a gold left accent line.

## Files

- Modify: `templates/game.html` (CSS within `{% block extra_css %}`)

## Steps

### Step 1: Update `.choices-area` spacing

Find the `.choices-area` rule and change:

```css
/* BEFORE */
.choices-area {
    display: flex; flex-direction: column;
    gap: 10px; margin-top: 14px;
    max-width: 880px;
    margin-left: auto; margin-right: auto;
}

/* AFTER */
.choices-area {
    display: flex; flex-direction: column;
    gap: 8px; margin-top: 10px;
    max-width: 100%;
}
```

### Step 2: Redesign `.choice-btn` to bookmark style

Find the `.choice-btn` rule and replace entirely:

```css
/* BEFORE */
.choice-btn {
    background: rgba(0, 0, 0, 0.55);
    border: 1.5px solid #8b6914;
    color: #f5ecd8;
    padding: 12px 22px;
    cursor: pointer;
    border-radius: 26px;
    font-size: 16px;
    font-family: "STKaiti", "KaiTi", serif;
    text-align: left;
    transition: all 0.15s;
}
.choice-btn:hover, .choice-btn.focused {
    background: #c99d57; color: #1a1a0a;
    border-color: #c99d57;
    outline: none;
    transform: translateX(-4px);
}

/* AFTER */
.choice-btn {
    background: rgba(45, 28, 12, 0.7);
    border: 1px solid #8b6914;
    border-left: 3px solid #c99d57;
    border-radius: 0 4px 4px 0;
    color: #f5ecd8;
    padding: 10px 18px;
    cursor: pointer;
    font-size: 15px;
    font-family: "STKaiti", "KaiTi", serif;
    text-align: left;
    transition: all 0.15s;
}
.choice-btn:hover, .choice-btn.focused {
    background: #c99d57;
    color: #1a1a0a;
    border-color: #c99d57;
    border-left: 4px solid #c99d57;
    box-shadow: -2px 0 8px rgba(201, 157, 87, 0.4);
    outline: none;
    transform: translateX(-4px);
}
```

### Step 3: Commit

```bash
git add templates/game.html
git commit -m "style: redesign choice buttons to bookmark/scroll style"
```

## Global Constraints

- Only modify CSS within `{% block extra_css %}`
- Do NOT change HTML structure
- Do NOT change JavaScript logic
- Do NOT change the hexagon nameplate design
- Font family must remain `"STKaiti", "KaiTi", serif`
