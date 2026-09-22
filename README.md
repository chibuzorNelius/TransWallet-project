# TransWallet

> **One place. One experience. A bridge between local banking, global transactions, and crypto requests.**

TransWallet is a frontend fintech simulation created as an academic and collaborative project to explore how different financial experiences can be brought together into one user-centered platform.

The project was designed around a simple question:

> **What if users could manage different financial activities from one place instead of constantly moving between different applications?**

TransWallet explores that idea through simulated authentication, OTP verification, money transfers, currency exchange, transaction history, crypto requests, cards, user support, and administrative workflows — all built with **HTML, CSS, and Vanilla JavaScript**.

Although the current implementation is a frontend demonstration rather than a production banking system, the project was intentionally designed as an opportunity to study and model concepts found in real-world financial applications.

---

# Table of Contents

- [The Problem](#the-problem)
- [Our Idea](#our-idea)
- [What is TransWallet?](#what-is-transwallet)
- [Project Vision](#project-vision)
- [What We Built](#what-we-built)
- [The TransWallet User Journey](#the-transwallet-user-journey)
  - [Landing Page](#1-landing-page)
  - [Authentication & OTP](#2-authentication--otp)
  - [Dashboard](#3-dashboard)
  - [Send Money](#4-send-money)
  - [Receive Money](#5-receive-money)
  - [Exchange Rate](#6-exchange-rate)
  - [Transactions](#7-transactions)
  - [Crypto Request](#8-crypto-request)
  - [Cards](#9-cards)
  - [Help Center](#10-help-center)
- [Meet the Team](#meet-the-team)
- [What We Learned](#what-we-learned)
- [Real-World Financial Concepts We Explored](#real-world-financial-concepts-we-explored)
- [From Prototype to Real-World Product](#from-prototype-to-real-world-product)
- [Technology](#technology)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Responsive Design](#responsive-design)
- [Running the Project](#running-the-project)
- [Collaboration & Git Workflow](#collaboration--git-workflow)
- [AI Coding Safety & Collaboration](#ai-coding-safety--collaboration)
- [Current Limitations](#current-limitations)
- [Future Development](#future-development)
- [Project Status](#project-status)
- [Team Reflection](#team-reflection)
- [License](#license)

---

# The Problem

Financial activities are becoming increasingly digital, but different financial needs are often separated across different platforms.

A user may have their everyday money in one bank, use another service for international transactions, another platform for currency conversion, and yet another service for crypto-related activities.

This creates a fragmented experience.

For example, a user who wants to perform an international transaction may need to:

1. Move money from their existing account.
2. Transfer the money to another financial platform.
3. Deal with currency conversion.
4. Complete the international transaction.
5. Potentially use another service for a crypto-related transaction.

The more platforms involved, the more steps, interfaces, credentials, and transaction processes the user has to deal with.

We wanted to explore a different approach.

---

# Our Idea

What if these experiences could be connected?

Instead of treating local transactions, global transactions, currency exchange, and crypto-related requests as completely separate experiences, we explored the idea of bringing them together inside one platform.

That idea became **TransWallet**.

TransWallet is designed as a conceptual bridge between:

**Local Banking**

↓

**Global Transactions**

↓

**Currency Exchange**

↓

**Crypto Requests**

The objective is not simply to create another banking interface.

The objective is to explore how different financial experiences could exist together inside one coherent user journey.

---

# What is TransWallet?

**TransWallet is a frontend-only fintech simulation that demonstrates a unified digital wallet experience.**

It allows users to interact with simulated financial workflows including:

- User registration
- Login
- OTP verification
- Dashboard and balance overview
- Sending money
- Receiving money
- Currency exchange
- Transaction history
- Crypto purchase requests
- Virtual cards
- Help and support
- Administrative workflows

The application does **not** currently process real money, connect to real bank accounts, or execute real cryptocurrency transactions.

Instead, the project uses frontend logic and simulated data to demonstrate how these experiences could work together.

---

# Project Vision

Our vision for TransWallet is based on one simple principle:

> **Financial experiences should feel connected, understandable, and accessible from one place.**

The project gave us an opportunity to move beyond individual HTML, CSS, and JavaScript exercises and think about how those technologies could be combined to model a larger real-world product.

We wanted the application to feel like more than a collection of separate pages.

Every page was designed to contribute to one larger experience.

---

# What We Built

TransWallet currently explores the following product areas:

| Feature | Purpose |
|---|---|
| Landing Page | Introduces the product and its value |
| Registration | Creates a simulated user account |
| Login | Provides simulated authentication |
| OTP Verification | Demonstrates an additional verification step |
| Dashboard | Central overview of the user's financial activity |
| Send Money | Simulates local and global transfer flows |
| Receive Money | Provides a simulated receiving experience |
| Exchange Rate | Displays currency conversion information |
| Transactions | Displays transaction history |
| Crypto Request | Simulates a crypto purchase request workflow |
| Cards | Demonstrates virtual card management |
| Help Center | Provides a support workflow |
| Admin Flow | Demonstrates administrative interaction with user requests |

---

# The TransWallet User Journey

The product was designed as a connected journey rather than a collection of unrelated screens.

The experience can be understood as:

**Landing Page → Authentication → Dashboard → Financial Actions → Support**

---

## 1. Landing Page

The landing page creates the first impression of TransWallet.

It introduces the product, its purpose, and the experience users can expect after entering the application.

Because the landing page is the first interaction with the product, we treated it as an important part of the product's identity.

### Team Contribution — Mazeed

Mazeed handled the landing page.

His knowledge and interest in media and graphics made him a natural choice for an area where visual communication and first impressions matter.

The goal was not simply to create a page that looked attractive.

The landing page needed to communicate the identity of TransWallet before the user even entered the application.

---

# 2. Authentication & OTP

After discovering the product, users need a secure entry point into the application.

TransWallet includes simulated:

- Registration
- Login
- OTP verification

The OTP flow was included to demonstrate how an additional verification step could be incorporated into the user journey.

### Team Contribution — Kolande

Kolani designed the login and registration forms and contributed ideas to the authentication flow.

His work established the entry point into the application and helped shape how users move from authentication into the main TransWallet experience.

---

# 3. Dashboard

The dashboard is the central point of the TransWallet experience.

It brings important information and actions together so that users can understand their financial activity from one place.

The dashboard provides the foundation for navigating into other parts of the application.

### Team Contribution — Mr. Habeeb

Mr. Habib worked on the dashboard design and structure.

Because the dashboard represents the core of the application, we wanted it to feel organized and easy to understand.

His contribution focused on bringing the different parts of the application together into a central interface.

### Team Contribution — Nelius

As team lead, I worked on the dashboard logic and helped connect the dashboard experience with the wider application.

This included thinking about how the different sections should interact and how the user's journey should continue from the dashboard into other financial functions.

---

# 4. Send Money

Sending money is one of the central experiences in a financial application.

TransWallet explores both local and foreign transfer experiences.

The interface was designed to demonstrate how a user could provide transaction information, interact with exchange information where necessary, and complete a simulated transfer.

### Team Contribution — Blessing

Blessing researched concepts around:

- Payment gateways
- Real-time transaction systems
- Transaction flows

She used that research to help inform the design of the Send Money page and how the transfer experience should work.

Her contribution allowed us to connect the interface design with our understanding of how transaction systems operate beyond the frontend.

---

# 5. Receive Money

TransWallet also includes a receiving-money experience.

The purpose is to complement the Send Money flow and demonstrate that the application is designed around movement of funds in both directions.

The receiving experience forms part of the wider transaction ecosystem represented inside the prototype.

---

# 6. Exchange Rate

Global transactions introduce another important problem:

**currency conversion.**

Different currencies have different values, and an international transaction needs a way to represent the conversion between them.

TransWallet therefore includes an exchange-rate experience.

The exchange section allows users to view currency information and interact with conversion-related functionality as part of the simulated global transaction journey.

### Team Contribution — Chidera Philip

Chidera worked on the exchange-rate feature.

His contribution focused on bringing exchange-rate information into the application and making it part of the user's transaction experience.

This gave the team an opportunity to explore how currency conversion information can be integrated into a financial interface.

---

# 7. Transactions

A financial application should provide users with a way to understand what has happened to their money.

TransWallet therefore includes a transaction history experience.

The transaction section is designed to demonstrate how activities such as transfers and other financial actions can be represented as historical records.

This also helped us think about how transaction information can remain connected across different parts of an application.

---

# 8. Crypto Request

Cryptocurrency was another area we wanted to explore.

However, TransWallet does **not** present itself as an in-app cryptocurrency wallet.

Instead, the project uses a **crypto request workflow**.

The concept is:

1. A user selects the cryptocurrency they want.
2. The user provides an external wallet address.
3. The user submits a crypto request.
4. The request enters a pending state.
5. The request can be reviewed through the administrative workflow.
6. Once approved, the simulated transaction flow can be completed.
7. The user is informed that they should check their external wallet.

This approach allowed us to explore crypto-related transaction workflows without pretending that the application itself holds or manages a real cryptocurrency balance.

### Team Contribution — Mr. Ezekiel

Mr. Ezekiel brought specific knowledge of cryptocurrency and blockchain concepts to the team.

Because of his understanding of the crypto space, the crypto request feature became an opportunity for him to contribute his knowledge while also educating the team about concepts surrounding cryptocurrency and blockchain.

He was therefore assigned the Crypto Request page.

His contribution helped us think beyond the interface and understand how a crypto-related request could fit into a broader financial application.

---

# 9. Cards

TransWallet includes a Cards section designed around virtual card management.

The concept explores how users could interact with a digital card inside the wider wallet experience.

The project also presents the idea of a physical card as a future feature rather than pretending that a physical card can actually be issued by the current prototype.

### Team Contribution — Nelius

I designed the Cards page as part of my contribution to the project.

The goal was to make the card experience feel like a natural part of the TransWallet ecosystem rather than a disconnected feature.

---

# 10. Help Center

Financial applications need to give users a way to get assistance when something goes wrong.

TransWallet therefore includes a Help Center designed around user support.

The Help Center explores a flow where users can raise an issue or request assistance, with the request connected to the administrative side of the application.

This allowed us to explore the idea that a financial application should not only process transactions but should also provide a support mechanism around those transactions.

### Team Contribution — Kolawale

Kolawale has a strong understanding of JavaScript logic and contributed to different areas of the application's logic.

He also designed the Help Center and helped establish the flow connecting user support requests with the administrative side of the application.

This created a more complete support experience rather than simply placing a static FAQ page inside the application.

---

# Meet the Team

TransWallet was built as a collaborative project.

Each member was given responsibility for a part of the application based on their interests, strengths, research, or contribution to the wider product.

## Mazeed — Landing Page

Mazeed worked on the Landing Page.

His interest and knowledge in media and graphics made him a suitable choice for the first visual interaction users have with TransWallet.

**Contribution:** Landing Page and first-impression experience.

---

## Kolande — Authentication

Kolande designed the Login and Registration experience and contributed ideas to the authentication flow.

**Contribution:**

- Login
- Registration
- Authentication flow concepts

---

## Mr. Habeeb — Dashboard

Mr. Habeeb worked on the Dashboard.

The dashboard serves as the central view of the application, bringing major features and information together in one organized experience.

**Contribution:** Dashboard design and structure.

---

## Mr. Ezekiel — Crypto Request

Mr. Ezekiel contributed his knowledge of cryptocurrency and blockchain concepts to the project.

He was responsible for the Crypto Request experience and helped the team understand the concepts behind the feature.

**Contribution:**

- Crypto Request page
- Crypto-related research and knowledge sharing
- Blockchain and cryptocurrency concepts

---

## Chidera — Exchange Rate

Chidera worked on the Exchange Rate feature.

His contribution helped bring currency conversion into the global transaction experience.

**Contribution:** Exchange Rate feature.

---

## Blessing — Send Money

Blessing researched payment gateways and real-time transaction systems and used that research to inform the Send Money experience.

**Contribution:**

- Send Money page
- Payment gateway research
- Transaction-system research

---

## Kolawale — JavaScript Logic & Help Center

Kolawale contributed to the application's JavaScript logic and designed the Help Center.

He helped establish the connection between user support requests and the administrative side of the application.

**Contribution:**

- JavaScript logic
- Help Center
- User-to-admin support flow

---

## Nelius — Team Lead, Developer & Integration

As the team lead, I contributed both technically and organizationally to TransWallet.

My work included:

- Cards page
- Dashboard logic
- Parts of the dashboard experience
- Connecting different areas of the application
- Coordinating team contributions
- Assigning responsibilities
- Working with the team through GitHub
- Reviewing how individual contributions fit into the complete product
- Helping maintain the overall direction of the project

My role was not limited to one page.

A major part of my responsibility was making sure that the different contributions could become **one product rather than several disconnected pages**.

---

# What We Learned

TransWallet became a practical learning environment beyond the classroom.

We did not simply build pages.

We used the project to explore how developers work together, how applications are structured, and how frontend technologies can be used to model real-world systems.

## 1. Team Collaboration

For many of us, TransWallet was one of our first serious experiences working together on one software project.

We learned that building software as a team requires more than dividing pages among people.

It requires:

- Communication
- Coordination
- Responsibility
- Consistency
- Reviewing each other's work
- Understanding how separate contributions fit together

---

## 2. Git & GitHub Collaboration

One of the major learning experiences was learning how to collaborate using Git and GitHub.

We worked with:

- Branches
- Commits
- Pushes
- Pulls
- Merging
- Pull requests
- Collaborative development workflows

We also encountered Git conflicts and learned how to resolve them.

This changed our understanding of Git from simply being a tool for uploading code to becoming a system for managing collaborative software development.

---

## 3. Deeper JavaScript

TransWallet pushed us beyond basic JavaScript.

During development, we explored more advanced JavaScript concepts, including asynchronous programming and:

```javascript
async
await

We also worked with frontend logic that connected different parts of the application and simulated real user flows.

---

## 4. SEO & Metadata

We also explored how a website is presented beyond the visible interface.

This included learning about metadata and how metadata can contribute to SEO and how search engines understand web pages.

This helped us understand that building a website is not only about what users see on the screen.

---

## 5. Thinking in Systems

Perhaps one of the biggest lessons from TransWallet was learning to think beyond individual pages.

A page does not exist alone.

A login page connects to authentication.

Authentication connects to the dashboard.

The dashboard connects to transactions.

Transactions connect to transfer flows.

Transfer flows connect to exchange information.

Crypto requests connect to administrative workflows.

Support requests connect users to administrators.

This taught us to think about **flows, relationships, and systems**, rather than only individual interfaces.

---

# Real-World Financial Concepts We Explored

Although TransWallet is a frontend simulation, the project gave us an opportunity to explore concepts that would become important when developing a real financial product.

These include:

### Payment Gateways

Payment gateways are services that allow applications to initiate and process electronic payments.

A production version of TransWallet would require properly integrated payment infrastructure rather than simulated frontend transactions.

### Transaction Processing

Real financial applications require systems that validate, authorize, record, and track transactions.

Our project uses frontend simulation to represent parts of this experience.

### Authentication & Verification

A production financial application requires secure identity and authentication systems.

Our project demonstrates the user experience through login, registration, and simulated OTP verification.

### APIs

A real TransWallet implementation would require secure APIs connecting the frontend to backend services, financial providers, exchange-rate providers, and other external systems.

### Currency Exchange

International transactions require reliable exchange-rate information and conversion logic.

Our prototype explores this experience on the frontend.

### Transaction Records

Financial systems need reliable transaction records, timestamps, references, statuses, and other information to track activity.

Our transaction-history experience demonstrates the user-facing side of this concept.

### Administrative Workflows

Financial applications require administrative systems for reviewing requests, handling exceptions, monitoring activity, and managing users.

Our prototype explores this concept through administrative flows such as crypto-request approval and Help Center requests.

### Security

A production financial application would require multiple layers of security, including secure authentication, authorization, encryption, fraud prevention, transaction verification, monitoring, and auditability.

These are areas that would need to be implemented on the backend and infrastructure layer before TransWallet could handle real financial activity.

---

# From Prototype to Real-World Product

TransWallet is intentionally a **frontend demonstration**.

That distinction matters.

The current project demonstrates:

- User interfaces
- User journeys
- Frontend logic
- Simulated authentication
- Simulated transactions
- Exchange experiences
- Crypto request workflows
- Administrative concepts
- User support flows

It does not currently provide the infrastructure required to operate as a real bank or financial institution.

A production version would require considerably more.

## A Possible Production Architecture

A real-world implementation could eventually involve:

```text
                    ┌──────────────────────┐
                    │      TransWallet     │
                    │    Web / Mobile UI   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Backend API     │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      Authentication       Transaction       User/Data
         Service            Service          Services
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       Payment Gateway     Exchange APIs      Crypto Services
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                       Secure Database