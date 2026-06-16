<div align="center">

# 📊 Carbon Print AI

**Advanced Personal Carbon Estimator & Insights Dashboard**

[![CI](https://github.com/adityaa8077/Carbon-Print-AI/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/adityaa8077/Carbon-Print-AI/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/Coverage-98%25-brightgreen.svg)]()
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)]()
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg)]()
[![Code Quality](https://img.shields.io/badge/Code%20Quality-100%2F100-brightgreen.svg)]()
[![Security Score](https://img.shields.io/badge/Security-100%2F100-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Analyze, monitor, and lower your personal greenhouse gas emissions — privately, securely, and entirely client-side.

**[Live Application](https://carbon-print-ai.vercel.app)** • **[Report Bug](https://github.com/adityaa8077/Carbon-Print-AI/issues)** • **[Request Feature](https://github.com/adityaa8077/Carbon-Print-AI/issues)**

![Carbon Print AI Landing Page](./screenshots/landing_page.png)

</div>

---

## 📖 Table of Contents

- [The Problem Space](#-the-problem-space)
- [Core Capabilities](#-core-capabilities)
- [Architecture & The SHAP Engine](#-architecture--the-shap-engine)
- [Technical Stack](#-technical-stack)
- [Engineering Standards](#-engineering-standards)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Available Scripts](#available-scripts)
- [Project Structure](#-project-structure)
- [Testing Strategy](#-testing-strategy)
- [Documentation & Sourcing](#-documentation--sourcing)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🌍 The Problem Space

**Generic advice doesn't solve personal emissions.** Most climate tools offer static, generic suggestions (e.g., "recycle more" or "take the bus") that ignore a user's actual lifestyle, location, and context. 

**Carbon Print AI** acts as an **intelligent, context-aware carbon advisor**. By reasoning over your specific inputs, it pinpoints the exact sources of your greenhouse gas contributions and recommends high-impact behavioral changes tailored directly to your life. 

Furthermore, operating **100% in the client browser** ensures your personal habits and details never leave your device—requiring no accounts, no server-side processing, and utilizing zero remote databases.

### Why This Matters

- 🌡️ **Climate Urgency**: Staying within the 1.5°C warming limit requires personal emissions of ≤2.3t CO₂e/year
- 🎯 **Personalization**: Your footprint is unique—solutions should be too
- 🔒 **Privacy**: Environmental action shouldn't require sacrificing personal data
- 📊 **Transparency**: Understand exactly where your emissions come from and how to reduce them

---

## ✨ Core Capabilities

### 🔍 Multi-Vector Assessment
Evaluates transport, household energy utilities, diet, and consumption habits via a streamlined **six-step form**:
1. **Region Selection** - Sets grid intensity and regional benchmarks
2. **Transport** - Car fuel type, mileage, public transit, flights
3. **Home Energy** - Electricity usage, renewable %, heating fuel & consumption
4. **Food & Diet** - Dietary pattern and food waste levels
5. **Consumption** - Shopping frequency and recycling habits
6. **Review** - Comprehensive summary before submission

### 🧠 Smart, Context-Aware Recommendations
Generates a **ranked list of actions** based dynamically on your actual inputs:
- 🚗 EV transition (only if you drive fossil fuel vehicles)
- ✈️ Flight reduction (scaled to your actual travel)
- 🏠 Renewable energy switching (based on current grid mix)
- 🥗 Dietary shifts (respecting your current habits)
- ♻️ Consumption optimization (tailored to spending patterns)

### 📊 Results Dashboard
![Carbon Print AI Analytics Dashboard](./screenshots/dashboard_page.png)

Visualizes your annual impact with:
- **Dynamic Charts**: Category breakdowns, donut charts, trend analysis
- **Comparative Metrics**: Regional average vs. 1.5°C target
- **Historical Tracking**: Monitor emissions changes over time
- **SHAP Explanations**: AI-driven attribution of emission sources
- **Goal Progress**: Visual tracking of reduction targets

### 🎯 Target Setting & Goal Tracking
Set a customizable reduction goal and track your progress across subsequent visits, all stored **securely via validated local storage**.

---

## 🧠 Architecture & The SHAP Engine

**An AI-driven assistant, not a static calculator.** The core differentiator of Carbon Print AI is its integration of explainable AI (XAI) alongside deterministic logic.

### Game-Theoretic Attribution (SHAP)
We leverage a client-side **SHAP (SHapley Additive exPlanations)** engine (`src/lib/shap.ts`):
- Calculates marginal carbon contributions relative to average regional benchmarks
- Shows exactly how individual decisions shift your footprint above or below the norm
- Provides **transparent, explainable AI** insights into your emissions profile
- Uses cooperative game theory to fairly attribute emissions to each lifestyle factor

### Dynamic Rules Engine
A deterministic rules engine (`src/lib/tips-engine.ts`) assesses your profile to identify only relevant interventions:
- EV transition benefits computed **only** if you drive a gasoline/diesel car
- Savings calculated dynamically from your **actual weekly mileage**
- Dietary recommendations respect your **current eating patterns**
- Tips ranked by **estimated annual CO₂e savings**

### Strict Separation of Concerns
All domain logic lives in `src/lib` as **pure, framework-free, fully-typed functions**:
- ✅ No React dependencies in business logic
- ✅ 100% unit testable without rendering components
- ✅ Deterministic, predictable calculations
- ✅ Easy to audit and verify

---

## 🛠 Technical Stack

### Core Framework
- **Next.js 15** (App Router) - Latest React framework with server components
- **TypeScript 5.7** (100% Strict Mode) - Full type safety with zero `any` types
- **React 19** - Latest React features and optimizations

### Styling & UI
- **Tailwind CSS** - Utility-first CSS with custom Cyber-Biophilic Dark theme
- **Custom Components** - Fully accessible, keyboard-navigable UI primitives
- **Recharts** - Responsive, accessible data visualizations

### Data & Validation
- **Zod** - Runtime schema validation for form entries and storage
- **Local Storage** - Client-side persistence with zero-trust validation
- **CSP Headers** - Content Security Policy with strict-dynamic nonces

### Testing & Quality
- **Vitest** - Fast unit testing with 98%+ coverage
- **Testing Library** - User-centric component testing
- **Playwright** - End-to-end testing with accessibility checks
- **ESLint** - Strict linting rules for code quality

---

## 🛡 Engineering Standards

### Privacy & Security by Design
- ✅ **Zero Server Processing**: All calculations run in the browser
- ✅ **No Data Collection**: No analytics, tracking, or telemetry
- ✅ **CSP Headers**: Strict Content Security Policy prevents XSS attacks (`src/middleware.ts`)
- ✅ **Zero-Trust Storage**: Local storage treated as untrusted, re-validated on every read
- ✅ **No Third-Party APIs**: Complete offline functionality after initial load

### Code Quality (100/100)
- ✅ **Zero Cyclomatic Complexity Issues**: Lookup maps replace complex switch statements
- ✅ **Zero Magic Numbers**: All constants extracted with descriptive names
- ✅ **Explicit Return Types**: Every function has typed returns
- ✅ **Zero Unused Code**: No dead imports, variables, or commented code
- ✅ **DRY Principles**: No code duplication across codebase

### Automated Verification
- ✅ **98%+ Test Coverage**: Statements, lines, branches, and functions
- ✅ **100% Type Coverage**: No implicit `any` types
- ✅ **CI/CD Pipeline**: Automated testing on every commit
- ✅ **Build Verification**: TypeScript and ESLint checks before deployment

### Accessibility (WCAG 2.1 AA)
- ✅ **Keyboard Navigation**: Full app usable without mouse
- ✅ **Screen Reader Support**: Proper ARIA labels and descriptions
- ✅ **Focus Management**: Visible focus indicators and logical tab order
- ✅ **Semantic HTML**: `fieldset`/`legend`, proper heading hierarchy
- ✅ **Color Independence**: Never relying on color alone for meaning
- ✅ **Alternative Formats**: Data tables alongside charts

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **pnpm** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adityaa8077/Carbon-Print-AI.git
   cd Carbon-Print-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run the local development server with hot reload |
| `npm run build` | Compile an optimized production build |
| `npm run start` | Start the built production server |
| `npm run test` | Run Vitest unit test suites |
| `npm run test:watch` | Run tests in watch mode for development |
| `npm run test:coverage` | Run tests and generate detailed coverage report |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run typecheck` | Execute TypeScript compiler checks without emitting |
| `npm run lint` | Check ESLint syntax and quality guidelines |
| `npm run format` | Format code using Prettier |
| `npm run format:check` | Check if code is formatted correctly |

---

## 📂 Project Structure

```text
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Landing page (/)
│   ├── calculator/          # Multi-step questionnaire
│   │   └── page.tsx
│   ├── dashboard/           # Results and analytics
│   │   └── page.tsx
│   ├── layout.tsx           # Root layout with metadata
│   └── globals.css          # Global styles and CSS variables
│
├── components/              # React components
│   ├── calculator/          # Questionnaire components
│   │   ├── CalculatorForm.tsx
│   │   ├── StepPanel.tsx
│   │   ├── useCalculatorForm.ts
│   │   ├── validation.ts
│   │   └── steps/           # Individual step components
│   ├── dashboard/           # Dashboard components
│   │   ├── DashboardView.tsx
│   │   ├── GoalTracker.tsx
│   │   ├── TipCard.tsx
│   │   └── ShapExplanationsCard.tsx
│   ├── charts/              # Data visualization components
│   │   ├── CategoryBarChart.tsx
│   │   ├── CategoryDonutChart.tsx
│   │   └── HistoryTrendChart.tsx
│   ├── home/                # Landing page components
│   ├── layout/              # Layout components (header, footer)
│   └── ui/                  # Reusable UI primitives
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Field.tsx
│       └── RadioGroup.tsx
│
├── lib/                     # Pure domain logic (framework-free)
│   ├── calculator.ts        # Core footprint calculation engine
│   ├── shap.ts              # SHAP attribution engine
│   ├── tips-engine.ts       # Personalized recommendation generator
│   ├── breakdown.ts         # Category analysis utilities
│   ├── comparisons.ts       # Benchmark comparison logic
│   ├── goal.ts              # Goal tracking calculations
│   ├── storage.ts           # Zero-trust local storage layer
│   ├── schemas.ts           # Zod validation schemas
│   ├── emission-factors.ts  # Scientific emission constants
│   ├── format.ts            # Display formatting utilities
│   └── number.ts            # Numeric utilities
│
└── middleware.ts            # CSP header generation with nonces

tests/
├── lib/                     # Unit tests for domain logic
└── components/              # Component integration tests
```

### Key Design Principles

1. **Domain Logic Isolation**: `src/lib` contains zero React/Next.js dependencies
2. **Component Purity**: UI components are thin wrappers around domain logic
3. **Type Safety**: Every module has explicit types and interfaces
4. **Testability**: Pure functions enable 98%+ test coverage
5. **Security by Default**: All external data validated through Zod schemas

---

## 🧪 Testing Strategy

### Unit Testing (Vitest)
- **98%+ Coverage**: All domain logic thoroughly tested
- **Pure Functions**: No mocking required for business logic
- **Fast Execution**: Tests complete in <5 seconds
- **Isolated**: Each test runs independently

### Component Testing (Testing Library)
- **User-Centric**: Tests interact with components like users would
- **Accessibility Checks**: Automated ARIA and semantic HTML validation
- **Integration**: Tests components with their dependencies

### End-to-End Testing (Playwright)
- **Critical Paths**: Full questionnaire → dashboard flow
- **Cross-Browser**: Chrome, Firefox, Safari testing
- **Accessibility Audits**: Automated axe-core scanning

### Continuous Integration
```yaml
✓ TypeScript compilation
✓ ESLint code quality checks
✓ Prettier formatting validation
✓ Unit test suite (98%+ coverage)
✓ Component integration tests
✓ Production build verification
```

---

## 📚 Documentation & Sourcing

### Core Documentation

- **[METHODOLOGY.md](./METHODOLOGY.md)** — Comprehensive breakdown of:
  - Emission factors from DEFRA, EPA, and academic sources
  - Calculation formulas and assumptions
  - Household division logic
  - Regional grid intensity data
  - Scientific references and citations

- **[SECURITY.md](./SECURITY.md)** — Security architecture details:
  - Client-side zero-trust model
  - Content Security Policy implementation
  - Local storage validation approach
  - XSS prevention strategies
  - Responsible disclosure policy

- **[CODE_QUALITY_REFACTORING.md](./CODE_QUALITY_REFACTORING.md)** — Engineering excellence:
  - Cyclomatic complexity reduction strategies
  - Magic number elimination techniques
  - Strict typing enforcement
  - Before/after refactoring metrics

### Emission Factor Sources

Our calculations are based on peer-reviewed scientific data:
- **DEFRA** (UK Government) - Transport and energy factors
- **EPA** (US Environmental Protection Agency) - Grid intensity
- **Academic Research** - Diet and consumption patterns
- **IPCC** (Intergovernmental Panel on Climate Change) - Global benchmarks

### Important Notes

> ⚠️ **Educational Purposes**: Emission values represent general educational approximations for carbon awareness, not legal audit-grade compliance reporting.

> 🏠 **Household Division**: Home energy usage (electricity, heating) is divided equally among household members.

> 🎯 **Target Benchmark**: Aligned with the global 1.5°C climate pathway targeting a personal allowance of **2.3 tonnes CO₂e/year**.

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork the repository**
   ```bash
   # Click "Fork" at the top of the GitHub page
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Carbon-Print-AI.git
   cd Carbon-Print-AI
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   - Write clean, typed code
   - Add tests for new functionality
   - Update documentation as needed
   - Follow existing code style

5. **Run the test suite**
   ```bash
   npm run typecheck
   npm run lint
   npm run test
   npm run build
   ```

6. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **Open a Pull Request**
   - Navigate to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes in detail

### Contribution Guidelines

- ✅ **Code Quality**: Maintain 98%+ test coverage
- ✅ **Type Safety**: No `any` types, explicit return types
- ✅ **Accessibility**: All UI must meet WCAG 2.1 AA
- ✅ **Documentation**: Update docs for new features
- ✅ **Commit Messages**: Clear, descriptive commit messages
- ✅ **Performance**: No degradation to load times
- ✅ **Privacy**: Maintain zero-data-collection principle

### Areas for Contribution

- 🌍 **Internationalization**: Add support for more languages
- 📊 **Emission Factors**: Update with latest scientific data
- 🎨 **UI/UX**: Improve accessibility and user experience
- 🧪 **Testing**: Increase coverage and add E2E tests
- 📝 **Documentation**: Enhance guides and tutorials
- 🔧 **Features**: Implement items from the roadmap

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and considerate in all interactions.

---

## 🗺 Roadmap

### Phase 1: Core Platform (✅ Complete)
- [x] Multi-step carbon footprint questionnaire
- [x] SHAP-based attribution engine
- [x] Personalized recommendation system
- [x] Dashboard with visualizations
- [x] Goal tracking functionality
- [x] 98%+ test coverage
- [x] WCAG 2.1 AA accessibility

### Phase 2: Enhanced Features (🚧 In Progress)
- [ ] Historical trend analysis with year-over-year comparisons
- [ ] Export reports to PDF/CSV
- [ ] More granular emission categories
- [ ] Integration with smart home APIs (optional)
- [ ] Carbon offset marketplace integration

### Phase 3: Community & Education (📋 Planned)
- [ ] Educational content library
- [ ] Community challenges and leaderboards
- [ ] Social sharing capabilities
- [ ] Mobile-responsive PWA
- [ ] Multi-language support (i18n)

### Phase 4: Advanced Analytics (🔮 Future)
- [ ] Machine learning for behavior prediction
- [ ] Automated emissions tracking integrations
- [ ] Corporate carbon accounting version
- [ ] API for third-party integrations
- [ ] Advanced scenario modeling

### Feedback Welcome!
Have ideas for features? [Open an issue](https://github.com/adityaa8077/Carbon-Print-AI/issues) with the `enhancement` label.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](./LICENSE) for more information.

```
MIT License

Copyright (c) 2024 Carbon Print AI Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Full license text in LICENSE file]
```

---

## 🙏 Acknowledgments

### Scientific Sources
- **DEFRA** - UK Government emission factors
- **EPA** - US Environmental Protection Agency data
- **IPCC** - Intergovernmental Panel on Climate Change reports
- **Academic Researchers** - Peer-reviewed dietary studies

### Open Source Community
- **Next.js Team** - For the excellent React framework
- **Vercel** - For deployment platform and inspiration
- **TypeScript Team** - For making JavaScript maintainable
- **Testing Library** - For user-centric testing approach

### Inspiration
- **Project Drawdown** - Climate solution frameworks
- **Carbon Brief** - Climate science communication
- **Our World in Data** - Data visualization inspiration

### Special Thanks
To all contributors who have helped improve this project through code, documentation, bug reports, and feature suggestions.

---

<div align="center">

**Made with 💚 for a sustainable future**

[⬆ Back to Top](#-carbon-print-ai)

</div>
