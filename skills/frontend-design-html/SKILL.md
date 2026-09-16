# frontend-design-html

## Purpose
Build and maintain responsive websites using semantic HTML, modern CSS, and vanilla JavaScript. This skill is intended for GitHub Pages and lightweight commercial showcase websites.

## Project defaults
- Prefer plain HTML, CSS, and JavaScript unless the user explicitly requests a framework.
- Keep the current site structure and existing content unless a change is requested.
- Use `index.html` for the main page, `styles.css` for styling, and `app.js` for interaction when those files already exist.
- Keep all output compatible with static hosting on GitHub Pages.

## HTML rules
- Use semantic elements such as `header`, `nav`, `main`, `section`, `article`, and `footer`.
- Include proper metadata, viewport settings, page title, and descriptive alt text for meaningful images.
- Keep heading hierarchy logical.
- Use buttons for actions and anchors for navigation.
- Avoid unnecessary wrappers and duplicated markup.

## CSS rules
- Use responsive, mobile-first layouts.
- Prefer Flexbox and Grid.
- Use CSS custom properties for reusable spacing, typography, and theme values when helpful.
- Avoid fixed heights that break on mobile.
- Add visible hover and focus states.
- Preserve readable contrast and comfortable line height.
- Keep selectors simple and avoid excessive `!important`.

## JavaScript rules
- Use vanilla JavaScript by default.
- Keep code modular and easy to understand.
- Prefer event listeners instead of inline JavaScript.
- Validate DOM targets before accessing them.
- Preserve existing functionality unless the user asks to replace it.
- For a showcase shopping cart, use client-side state or localStorage unless a real backend is explicitly requested.

## Workflow
1. Inspect the current files before modifying them.
2. Identify which file or files need changes.
3. Preserve working code and existing product information.
4. Make the smallest complete change that satisfies the request.
5. Check desktop and mobile behavior conceptually.
6. Verify navigation, buttons, forms, and cart interactions.
7. Commit changes with a clear message.

## GitHub Pages constraints
- Do not rely on server-side code for a static GitHub Pages site.
- Use relative asset paths where practical.
- Avoid secrets, API keys, private credentials, and private customer data in frontend files.
- If the requested feature requires a database, authentication, payments, or secure order processing, explain that a backend service is required before implementing it.

## User-facing priorities
For the 一縷清香 project, prioritize:
- elegant incense-product presentation
- clean product cards
- clear pricing and calls to action
- responsive mobile layout
- a simple shopping-cart experience
- fast loading
- maintainable code

When asked to edit the site, inspect existing files first and modify the current implementation instead of rebuilding everything without need.
