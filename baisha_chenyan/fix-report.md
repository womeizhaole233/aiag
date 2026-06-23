# Fix Report: Game Page CSS Missing

## Issue

`game_content.html` (AJAX-loaded game page) contained no CSS styles. When navigating to the game page via AJAX (using the content-loader), all game UI elements (dialogue boxes, backgrounds, portraits, menus, chapter overlays) rendered without styling, making the game unusable.

Root cause: `game.html` had 458 lines of CSS in `{% block extra_css %}` as inline `<style>`, but `game_content.html` was a bare HTML fragment with no CSS reference. The AJAX loader only extracts `#app-content` innerHTML, so the `<style>` block from `game.html` was never included.

## Fix

Extracted all game CSS into a standalone file and ensured both loading paths include it:

1. **Created `static/css/game.css`** — 454 lines of CSS extracted from `game.html`'s `{% block extra_css %}` block.

2. **Modified `templates/game.html`** — Replaced the inline `<style>` block with:
   ```html
   <link rel="stylesheet" href="/static/css/game.css">
   ```

3. **Modified `templates/game_content.html`** — Added a self-executing script at the top that dynamically injects the CSS `<link>` into `<head>` (with deduplication check):
   ```html
   <script>
   (function(){
       if (!document.querySelector('link[href="/static/css/game.css"]')) {
           var link = document.createElement('link');
           link.rel = 'stylesheet';
           link.href = '/static/css/game.css';
           document.head.appendChild(link);
       }
   })();
   </script>
   ```

## Commit

```
4684c8a333d61be30f7dafe67e9ed2b17249a4de
```

## Test Results

- **Direct navigation to `/game`**: `game.html` loads with `<link>` to `game.css` — OK
- **AJAX navigation via content-loader**: `game_content.html` is fetched, script executes, `game.css` is injected into `<head>` — OK
- **Deduplication**: If `game.css` already loaded (e.g., from base page), script skips re-injection — OK
- **All CSS selectors present in `game.css`**: dialogue-layer, portrait-layer, player-menu, debug-panel, chapter-overlay, etc. — OK
