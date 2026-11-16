# Interactions

A library of 112 web interactions you can try in the browser. Open `index.html` (or the GitHub Pages site) and press play on any cell.

## Layout

- **Navigation:** the name on the left, a search icon on the right. Click the icon (or press `/` or `Ctrl/Cmd + K`) and the search panel springs open in the middle. Search is typo-tolerant ("sprng" finds "spring") and ranks name matches above description matches.
- **Left panel:** every interaction in one flat, numbered list. No sections or categories.
- **Middle canvas:** a grid of 3 or 4 columns (4 when there is room) and as many rows as needed. Each cell has a play button, and nothing moves until you press it. Only one interaction plays at a time.
- **Right panel:** the selected interaction's details, its extra controls (when it has any) and live values.

## Files

```
index.html            page shell
css/style.css         layout, grid lines, controls, search
fonts/Fragmentcore.otf
js/core.js            registry + shared helpers (loop, canvas, pointer, springs, FLIP, icons)
js/app.js             index, canvas, right panel, play/stop, search
js/demos/*.js         the 112 interactions, one IX.add({...}) each
teardowns/            interaction breakdowns of real websites
```

To add an interaction, call `IX.add({ name, desc, controls, build(stage, P, api) })` in a file under `js/demos/`. The header of `js/core.js` describes the format.

This repo is updated once a month. If you have a suggestion, email workdesk.avishek@gmail.com and I'll be happy to add it with a shoutout.
