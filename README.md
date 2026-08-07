# Trans Wallet Project

Trans Wallet Project is a frontend-only fintech simulation designed to help product, design, and engineering teams prototype a modern wallet experience without a backend.

## Project Description

This repository provides a professional starter workspace for a scalable wallet application with simulated authentication, balances, transfers, exchange, transaction history, crypto purchase requests, and profile management.

## Features

- Landing experience and onboarding flow
- Registration and login simulation
- Simulated OTP verification
- Wallet balance overview
- Send and receive money flows
- Currency exchange simulation
- Transaction history views
- Crypto purchase request workflow
- Profile and settings management

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Responsive mobile-first layout

## Folder Structure

```text
assets/       Static images, icons, logos, and fonts
css/           Global styles, design tokens, component styles, page styles
docs/          Product, architecture, and team documentation
js/            Frontend simulation logic and state helpers
pages/         Semantic HTML page templates
.github/       Contribution templates
```

## Installation

1. Clone the repository.
2. Open the project folder in your editor.
3. Launch any static file server from the project root.

Example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000/pages/landing.html.

## How to Contribute

- Create a feature branch from main.
- Follow the documented coding standards.
- Keep changes scoped and documented.
- Open a pull request with context and screenshots when relevant.

## Git Workflow

- main: production-ready baseline
- feature/*: new features
- bugfix/*: fixes
- chore/*: maintenance and setup

## Coding Standards

- Clean architecture and modular JavaScript
- Semantic HTML
- Modern CSS and CSS variables
- Consistent naming and readable formatting
- Meaningful comments and TODO markers

## Design System Summary

- Primary blue: #2563EB
- Success green: #10B981
- Warning: #F59E0B
- Danger: #EF4444
- Background: #F8FAFC

## Responsive Requirements

The project should remain mobile-first and support:
- 320px
- 375px
- 768px
- 1024px
- 1440px+

No horizontal scrolling is expected.

## Future Roadmap

- Reusable UI component library
- State management layer
- Accessibility improvements
- Design token refinement
- Prototype testing and analytics hooks

## License

This project is licensed under the MIT License.

## Credits

Built as a starter frontend fintech simulation for product and engineering teams.

## AI Coding Safety & Collaboration Guidelines

To maintain a stable development baseline and support collaborative multi-developer contributions, all developers and their AI coding assistants must strictly adhere to the following rules:

### 🚫 Prohibited AI Actions
- **DO NOT rewrite or restructure the visual design variables** in `css/variables.css` without approval from the project lead.
- **DO NOT create, delete, rename, or reorganize project files or folders**. Keep the project structure exactly as defined.
- **DO NOT duplicate the navigation sidebar or bottom menu markup** in individual pages. The navigation shell is handled centrally and dynamically by `js/app.js`.
- **DO NOT introduce frontend frameworks** (React, Vue, TailwindCSS, etc.), backend servers, databases, or third-party API dependencies. The project must remain a static HTML/CSS/Vanilla JS experience.
- **DO NOT modify another developer's page or CSS files** unless explicitly requested.

### ✅ Expected AI Behavior
- **Isolation**: Make the smallest necessary code changes, strictly scoped inside your assigned page/module (e.g. `pages/send-money.html`, `js/transfer.js`, etc.).
- **Comments**: Keep global layout headers, styles, and script entry points intact. Add informative developer comments to prevent accidental regressions.
- **Viewport Verification**: Test layout changes on mobile, tablet, and desktop viewports to ensure the shared layout transitions correctly and has no horizontal scrolling.

