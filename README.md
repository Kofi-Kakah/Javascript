# Counter — Vanilla JavaScript Project

A dependency-free counter application built with plain **HTML**, **CSS**, and **JavaScript**, bundled with a pure-CSS infinite marquee carousel. This project exists as a hands-on exercise in DOM manipulation, event handling, and CSS animation — no frameworks, no build tools, no `npm install`.

![Project Preview](preview.png)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [How It Works](#how-it-works)
  - [DOM Reference](#dom-reference)
  - [State](#state)
  - [Event Flow](#event-flow)
  - [Reset Semantics](#reset-semantics)
- [Styling](#styling)
- [The Carousel](#the-carousel)
- [Configuration](#configuration)
- [Browser Support](#browser-support)
- [Project Structure Detail](#project-structure-detail)
- [Known Quirks & Notes](#known-quirks--notes)
- [Ideas for Improvement](#ideas-for-improvement)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview

This is a single-page counter application. The user can increment, decrement, and reset a running value, while the interface independently tallies how many times each action has been performed. Below the counter sits a horizontally scrolling marquee of cards, implemented entirely in CSS so it animates without any JavaScript involvement.

The whole application is three files and roughly 200 lines of code, which makes it easy to read end-to-end and ideal as a reference implementation or a starter for learning the DOM.

**Live demo:** _Add a link here (e.g. GitHub Pages, Netlify, or Vercel deployment)_

---

## Features

### Counter

- **Increment** — increases the count by `1` and updates the display immediately.
- **Decrement** — decreases the count by `1` (the value may go negative).
- **Reset** — returns the count to `0`.
- **Per-action statistics** — three independent tallies track how many times *Increment*, *Decrement*, and *Reset* have been clicked during the session.
- **Conditional reset counting** — the reset tally only increments when the counter was actually non-zero, so clicking *Reset* at `0` does not inflate the statistics.
- **Live DOM updates** — every interaction writes directly to the affected element via `textContent`; no re-render, no framework diffing.

### Carousel

- **Infinite marquee** — cards scroll continuously from right to left.
- **Seamless loop** — the card group is duplicated in the DOM, so the animation appears continuous with no visible seam or restart.
- **Pure CSS** — the animation runs off the main thread and does not depend on `index.js` at all.
- **Custom scrollbar** — the native WebKit scrollbar is hidden for a cleaner presentation.
- **ARIA-aware** — the duplicated group is marked `aria-hidden="true"` so assistive technologies do not announce the same cards twice.

### General

- **Zero dependencies** — nothing to install, nothing to build.
- **Responsive** — fluid widths and a viewport meta tag keep the layout usable on mobile.
- **Fully offline-capable** — works from a local file, a USB stick, or any static host.

---

## Tech Stack

| Technology | Role | Notes |
| :--------- | :--- | :---- |
| **HTML5** | Document structure | Semantic elements (`<h1>`, `<p>`, `<button>`, `<hr>`) |
| **CSS3** | Presentation & motion | Flexbox, `border-radius`, CSS `translate` property, `@keyframes` |
| **Vanilla JavaScript** | Behaviour | ES2015+ features (`let`, `const`, arrow functions) |
| **VS Code** | Editor | Recommended editor, Live Server extension |
| **Git / GitHub** | Version control | Repository: [Kofi-Kakah/Javascript](https://github.com/Kofi-Kakah/Javascript) |

No package manager, no bundler, no transpiler, no runtime framework.

---

## Project Structure

```
Javascript/
├── .vscode/
│   └── settings.json      # Live Server configuration (port 5501)
├── .git/                  # Version control history
├── index.html             # Markup: counter panel + carousel
├── index.css              # Styles, hover effects, marquee animation
├── index.js               # Counter logic and event listeners
├── preview.png            # Screenshot (add to repository)
└── README.md              # This file
```

---

## Getting Started

### Prerequisites

Only two things are required:

1. A modern web browser (Chrome, Edge, Firefox, or Safari).
2. Optionally, [Visual Studio Code](https://code.visualstudio.com/) with the **Live Server** extension for hot-reloading during development.

There is no `package.json`, and therefore no `npm install` step.

### Option A — Open directly (fastest)

Double-click `index.html` and it opens in your default browser. The application works fully offline via the `file://` protocol.

### Option B — Live Server (recommended for development)

1. Open the project folder in VS Code.
2. Install the **Live Server** extension by Ritwick Dey.
3. Right-click `index.html` → **Open with Live Server**.
4. The app is served at `http://127.0.0.1:5501` (port pre-configured in `.vscode/settings.json`).
5. Edits to the HTML, CSS, or JS are applied instantly on save.

### Option C — Any static server

```bash
# Python
python -m http.server 5501

# Node.js
npx serve -l 5501 .
```

Then browse to `http://localhost:5501`.

---

## Usage

1. Launch the app using any method above.
2. The counter panel displays `Count: 0` on load.
3. Click **Increment** — the count rises and the *Increment Times* tally increases.
4. Click **Decrement** — the count falls and the *Decrement Times* tally increases.
5. Click **Reset** — the count returns to `0`. The *Reset Times* tally only increases if the count was not already `0`.
6. Watch the marquee of cards scroll beneath the counter.

### Expected behaviour

| Action | Count | Increment tally | Decrement tally | Reset tally |
| :----- | :---- | :-------------- | :-------------- | :---------- |
| Initial load | `0` | `0` | `0` | `0` |
| Increment ×1 | `1` | `1` | `0` | `0` |
| Increment ×2 | `3` | `3` | `0` | `0` |
| Decrement ×1 | `2` | `3` | `1` | `0` |
| Reset (from `2`) | `0` | `3` | `1` | `1` |
| Reset (from `0`) | `0` | `3` | `1` | `1` (unchanged) |

The three tallies are cumulative for the lifetime of the page and are **not** cleared by the Reset button.

---

## How It Works

### DOM Reference

On load, `index.js` grabs every element it needs once and stores it in a `const` binding (`index.js:2-8`). This avoids repeated `document.getElementById` lookups inside event handlers.

```js
const counterElement      = document.getElementById('counter');
const incrementButton     = document.getElementById('increment');
const decrementButton     = document.getElementById('decrement');
const resetButton         = document.getElementById('reset');
const resetTimesElement   = document.getElementById('reset-times');
const decrementTimesElement = document.getElementById('decrement-times');
const incrementTimesElement = document.getElementById('increment-times');
```

Because the script tag sits at the end of `<body>` (`index.html:47`), the DOM is already fully parsed when the script executes, so no `DOMContentLoaded` wrapper is required.

### State

Four variables hold all application state (`index.js:1`, `index.js:9-11`):

| Variable | Type | Purpose |
| :------- | :--- | :------ |
| `count` | `let` (number) | The current counter value |
| `resetTimes` | `let` (number) | Total resets performed |
| `decrementTimes` | `let` (number) | Total decrements performed |
| `incrementTimes` | `let` (number) | Total increments performed |

`let` is used (rather than `const`) for the mutable values; the element references are `const` because they are never reassigned.

### Event Flow

Each button has a single, self-contained listener that performs three steps:

1. **Mutate** the in-memory state.
2. **Write** the new value to the DOM.
3. **Update** the corresponding statistics tally.

```js
incrementButton.addEventListener('click', () => {
    count++;
    counterElement.textContent = count;
    incrementTimes++;
    incrementTimesElement.textContent = incrementTimes;
});
```

`increment` and `decrement` use `addEventListener('click', ...)`, while `reset` uses the equivalent DOM property form `resetButton.onclick = ...` (`index.js:28`). Both styles work identically; the project intentionally shows both.

### Reset Semantics

Reset is the only action with conditional bookkeeping (`index.js:28-35`):

```js
resetButton.onclick = () => {
    if (count !== 0) {
        resetTimes++;
        resetTimesElement.textContent = resetTimes;
    }
    count = 0;
    counterElement.textContent = count;
}
```

The guard `if (count !== 0)` ensures that repeatedly clicking *Reset* on an already-zero counter does not inflate the reset statistic. The count is reset unconditionally, outside the guard.

---

## Styling

The visual identity is intentionally simple and high-contrast: a dark-grey rounded panel centred in the viewport, with three colour-coded action buttons.

### Layout

- `.container` uses `display: flex` with `flex-direction: column` and `height: 100vh` to centre the counter panel vertically and horizontally.
- `#chl-container` is the panel itself: `text-align: center`, `max-width: 500px`, `padding: 100px 50px`, and `border-radius: 10% 10%` for the rounded corners.

### Colour system

| Element | Normal state | Hover state |
| :------ | :------------ | :----------- |
| `#increment` | `rgb(53, 241, 53)` — green | `hsl(120, 86%, 71%)` |
| `#decrement` | `rgb(74, 74, 243)` — blue | `hsl(240, 84%, 71%)` |
| `#reset` | `rgb(241, 53, 53)` — red | `hsl(0, 90%, 67%)` |
| Panel | `darkgrey` background | — |
| Heading / counter | `rgb(241, 241, 241)` / `aqua` accent | — |

### Typography

`Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif` is applied to the heading, the counter value, and the buttons — a condensed display face with a system fallback stack.

### Interaction feedback

Every button shares the same hover treatment:

```css
#increment:hover {
    background-color: hsl(120, 86%, 71%);
    transform: scale(1.1);
    transition: all 0.3s ease;
}
```

A `scale(1.1)` lift with a smooth `0.3s` `all` transition gives immediate tactile feedback. `#counter` is sized at `4rem` and the `h1` at `3rem` to establish clear visual hierarchy.

---

## The Carousel

The marquee is implemented entirely in CSS and is completely independent of the counter logic.

### Markup

`index.html:28-45` contains a `.carousel` wrapper with **two identical `.group` divs**, each holding six `.card` elements. The second group is marked `aria-hidden="true"`.

```html
<div class="carousel">
    <div class="group">…6 cards…</div>
    <div aria-hidden class="group">…6 identical cards…</div>
</div>
```

### Animation

```css
.group {
    display: flex;
    gap: 1em;
    animation: spin 5s infinite linear;
    padding-right: 1em;
}

@keyframes spin {
    from { translate: 0; }
    to   { translate: -100%; }
}
```

The keyframes translate the group by exactly its own width (`-100%`). Because the second group is an identical copy sitting immediately after the first, when the first group has fully moved off-screen the second occupies the same position — producing a continuous loop with no visible jump. The `infinite` keyword repeats the cycle forever and `linear` keeps the speed constant (no easing in or out).

### Scrollbar

```css
.carousel::-webkit-scrollbar { display: none; }
```

The horizontal scrollbar is hidden on WebKit browsers so the marquee reads as a designed element rather than a scroll region.

---

## Configuration

### Live Server port

`.vscode/settings.json` pre-configures the Live Server extension:

```json
{
    "liveServer.settings.port": 5501
}
```

Change the value to any free port if `5501` is already occupied on your machine.

### Title and metadata

`index.html:7` sets the browser tab title:

```html
<title>Counter</title>
```

---

## Browser Support

The application uses only widely supported, standards-based features:

| Feature | Requirement | Supported since |
| :------ | :---------- | :--------------- |
| `let` / `const` | ES2015 | Chrome 49, Firefox 45, Safari 10, Edge 15 |
| Arrow functions | ES2015 | Chrome 45, Firefox 22, Safari 10, Edge 12 |
| `addEventListener` | DOM Level 2 | Universal |
| Flexbox | CSS Flexbox | Chrome 29, Firefox 28, Safari 9, Edge 12 |
| `translate` property | CSS Transforms L2 | Chrome 104, Firefox 72, Safari 14.1, Edge 104 |
| `@keyframes` | CSS Animations | Chrome 43, Firefox 16, Safari 9, Edge 12 |

The `translate` longhand property is the most recently adopted feature. On browsers older than Chrome 104 / Firefox 72 / Safari 14.1, the carousel will not animate — swapping `translate` for `transform: translateX(...)` in the `@keyframes` block restores compatibility with a minimal change.

---

## Known Quirks & Notes

These are current, intentional-or-inherited behaviours of the code. They are documented rather than hidden so the next person knows they are expected.

1. **The `Count:` label disappears on first click.**
   `counterElement.textContent = count` (`index.js:16`, `index.js:23`) overwrites the *entire* contents of `<p id="counter">`, which includes the `<strong style="color: aqua;">Count:</strong>` label. The counter renders as a bare number after the first interaction. A fix would be to target a dedicated inner element for the numeric value and leave the label untouched.

2. **Statistics tallies are not reset.**
   The *Reset Times* / *Decrement Times* / *Increment Times* counters accumulate for the lifetime of the page. Clicking *Reset* clears only the main count.

3. **The count may go negative.**
   There is no floor at zero. Decrementing from `0` produces `-1`, `-2`, and so on. This is arguably useful for exercising the state logic.

4. **State is not persisted.**
   Refreshing the page resets the count and all three tallies. `localStorage` would be needed to preserve them.

5. **Inconsistent listener style.**
   `increment` and `decrement` use `addEventListener`, while `reset` assigns the `onclick` property. Both are valid; the project shows both idioms. Unifying them would be a small consistency improvement.

6. **The carousel is decorative.**
   The cards scroll automatically but are not interactive — there is no click handling, no drag support, and no pause-on-hover. `aria-hidden` on the duplicate group is correct, but the visible group could arguably be marked `aria-hidden` as well if the content is purely ornamental.

7. **Indentation in `index.js` is inconsistent.**
   The file mixes an 8-space and 12-space indentation style, inherited from its incremental development. A formatter pass (e.g. Prettier) would clean this up.

---

## Ideas for Improvement

A natural progression path for this project:

- [ ] Wrap the counter value in its own `<span>` so the `Count:` label survives updates.
- [ ] Persist state to `localStorage` so the count survives a refresh.
- [ ] Add keyboard support (`ArrowUp` / `ArrowDown` / `R`) for accessibility.
- [ ] Guard against negative values with a `count > 0` floor.
- [ ] Add a `Reset Statistics` button to zero the three tallies independently.
- [ ] Pause the carousel on hover and add `prefers-reduced-motion` handling.
- [ ] Convert the carousel to a reusable Web Component.
- [ ] Add unit tests with a headless browser (Playwright / Vitest + jsdom).
- [ ] Apply a CSS custom-property theme so colours live in one place.
- [ ] Deploy to GitHub Pages for a public live demo.

---

## Contributing

Contributions are welcome.

1. Fork the repository on GitHub.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Make your changes, keeping commits small and focused.
4. Test in at least two browsers.
5. Open a pull request describing what changed and why.

### Commit message convention

```
<type>(<scope>): <short description>

types: feat, fix, style, refactor, docs, chore
```

Examples:

```
feat(counter): add keyboard shortcuts for increment/decrement
fix(carousel): replace translate longhand with transform for compatibility
docs(readme): document reset semantics
```

---

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).

```
MIT License

Copyright (c) 2026 Kofi-Kakah

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Acknowledgements

- **VS Code Live Server** — Ritwick Dey, for the zero-config local development server.
- **MDN Web Docs** — for the authoritative references on the DOM, Flexbox, and CSS animations used throughout this project.
- Everyone who has contributed issues, suggestions, and code to the repository.

---

<div align="center">

**Built with vanilla HTML, CSS, and JavaScript.**

</div>
