# System Architecture

## Overview

The system is structured as a modular frontend application that simulates a fintech experience using static HTML, CSS, and JavaScript.

## Modules

- Authentication: registration, login, and OTP experience
- Wallet: balance summary and account actions
- Transfers: send and receive money
- Exchange: simulated currency conversion
- Transactions: history views and filters
- Crypto: purchase request handling
- Profile: account settings and user preferences

## Feature Relationships

Each module is designed to share a common state layer through the JavaScript utilities and storage helpers. Pages are intentionally independent but can reference shared logic for consistency.

## Folder Organization

- pages/: route-like HTML entry points
- css/: shared global styling and page-specific styles
- js/: business logic and simulation helpers
- docs/: planning and team guidance
- assets/: static media and brand resources

## Data Flow

User interaction on a page triggers a JavaScript module that updates simulated state through the storage helper. UI elements are then refreshed to reflect the new state.

## JavaScript Responsibilities

- app.js: shared bootstrap and page initialization
- auth.js: registration, login, and session simulation
- otp.js: OTP workflow logic
- wallet.js: wallet summary and account actions
- transfer.js: send and receive money logic
- exchange.js: exchange simulation
- transactions.js: history rendering
- crypto.js: crypto request flow
- notifications.js: notifications and alerts
- profile.js: profile and settings interactions
- storage.js: JSON-like local state management
- utils.js: helper methods and shared formatting functions
