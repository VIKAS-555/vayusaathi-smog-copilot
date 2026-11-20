# VayuSaathi (वायुसाथी) — Build & Engineering Log
*Household Air & Exposure Co-Pilot — PromptWars Virtual Challenge Entry*

---

## 📌 1. Problem Statement & MVP Scope

### The Problem
During severe winter smog episodes across Indian metros and the Indo-Gangetic Plains (Delhi NCR, Noida, Gurugram, Kolkata, Lucknow, Patna), meteorological temperature inversions trap hazardous particulate matter ($PM_{2.5}$, $PM_{10}$, $NO_2$) close to ground level for weeks. Families, vulnerable children, elderly relatives, and asthmatics face acute health emergencies.

Most existing air quality tools merely report a scary, monolithic AQI number without actionable, contextual guidance. Households struggle to know:
- When is the precise diurnal ventilation window to open windows vs. sealing against inversion peaks?
- What low-cost or zero-cost interventions work if they cannot afford expensive multi-unit HEPA purifiers?
- What daily schedule swaps minimize personal inhalation doses without disrupting work/school life?
- How does community action (e.g., apartment complex diesel generator bans, shared school carpooling) multiply their individual effort?

### MVP Scope & 4 Integrated Capabilities
1. **Hyper-Local Smog & Inversion Context Bar:**
   - Indian metro/city presets (Delhi NCR, Gurugram, Noida, Mumbai, Kolkata, Bengaluru, Lucknow) + custom AQI/$PM_{2.5}/PM_{10}$ manual inputs.
   - Live meteorological indicators: AQI category, dominant pollutant, humidity/wind, and a **24-Hour Diurnal Smog & Ventilation Curve** visually mapping temperature inversion danger hours vs. safe cross-ventilation windows.
2. **Multi-Member Household & Lifestyle Profiler:**
   - Frictionless configuration for household members (Adults, Children, Seniors, Asthma/Respiratory sensitivity).
   - Housing type (High-rise apartment, Ground/street-facing house, Purifier availability vs. none).
   - Lifestyle inputs (Commute mode & distance km, morning/evening outdoor exercise habits, cooking fuel).
3. **GenAI-Tailored Action Engine (3 Structured Views):**
   - **Low-Emission Daily Routine:** Diurnal hour-by-hour schedule tailored to family members and local inversion curve.
   - **Indoor Air Quality (IAQ) Hacks:** Tiered into **Zero-Cost Behavioral Habits**, **Low-Cost DIY Fixes (< ₹1,500)**, and **Purifier / Filtration Optimization**.
   - **Sustainable Alternatives & Community Actions:** Practical commute swaps, household energy/waste habits, and society-level interventions.
4. **Interactive Impact & Exposure Simulator (Standout Feature):**
   - Interactive **"Adopt Habit" toggles** on all recommendations that immediately recalculate and animate:
     - **Personal Health Impact:** Daily $PM_{2.5}$ inhaled dose reduction ($\mu\text{g/day}$), % exposure drop per family member, and intuitive equivalencies (e.g., passive cigarette smoke avoided).
     - **Community & Climate Impact:** Monthly $\text{CO}_2$ saved (kg) and particulate matter prevented (g), with an interactive **Community Multiplier Slider** (*"If 10 / 50 / 200 families in your apartment complex adopt these swaps"*).
     - **RWA / Society WhatsApp Smog Bulletin Modal:** One-click formatted community alert card with the day's local smog status and top 3 collective actions ready to copy/share.

---

## 🔄 2. Prompt Iterations Log

| # | Prompt Focus / User Request | Key Changes & Engineering Implementation | Trade-offs & Lessons Learned |
|---|-----------------------------|------------------------------------------|------------------------------|
| **1** | Repository Initialization & Baseline Hygiene | Initialized Git repository on `main` branch, authored comprehensive multi-runtime `.gitignore` (Node, Python, OS, IDE, Secrets), and established baseline `README.md`. | Verified clean Git tree and established direct remote link commands. |
| **2** | Architecture, Design System & Build Log Foundation | Established `BUILD_LOG.md`, locked in "Atmospheric Civic & Environmental Editorial" design principles, and prepared tech stack clarification. | Strictly rejected generic AI aesthetic (neon gradients, glassmorphism) in favor of high-legibility, publication-grade civic public health aesthetics. |
| **3** | Product Blueprint & Execution Lock-in | Solidified the 4 integrated product modules, mathematical inhalation calculation engine, and screenshot checklist. Prepared 3 targeted architectural choices for user confirmation. | Confirmed hybrid architecture: deterministic environmental physics for metrics + Gemini 2.5 structured JSON for qualitative reasoning. |
| **4** | End-to-End Application Build & Dev Server Launch ("do it for me") | Scaffolded Next.js 14 (App Router, TypeScript, Tailwind CSS), implemented the complete Environmental Math Inhalation Engine (`src/lib/environmentMath.ts`), dual-mode Gemini structured service (`src/lib/geminiService.ts`), Context Bar with 24h Diurnal Curve, Household Profiler, 3-Tab Action Engine with habit toggles, and RWA WhatsApp Bulletin Modal. Verified zero-error production build (`npm run build`) and launched server on `localhost:3001`. | Port 3000 was in use by another local process, so Next.js gracefully bound to `3001`. All health metrics strictly computed client/server-side with zero LLM hallucinations. |
| **5** | GitHub Pages Deployment & Automated CI/CD Pipeline | Added GitHub Pages deployment workflow (`.github/workflows/deploy.yml`) using GitHub Actions, configured `next.config.js` with `output: 'export'` and dynamic `basePath` support for GitHub Pages static site hosting. Verified static build generation (`out/`). | Enabled 100% zero-cost static hosting on `github.io` without requiring dedicated Node server infrastructure while preserving local dev dynamic behavior. |
| **6** | Remote GitHub Creation & CI/CD Bug Remediation ("cant see this repo on my github") | Retrieved local macOS Keychain GitHub credentials for `VIKAS-555`, created `vayusaathi-smog-copilot` via GitHub REST API, linked remote origin, and pushed all commits. Remediated webpack build error where Python's `lib/` pattern in `.gitignore` was unintentionally ignoring TypeScript modules in `src/lib/`. Scoped ignore to `/lib/`, staged `src/lib/`, enabled GitHub Pages API, and verified successful GitHub Actions build (HTTP 200 on `github.io`). | Resolved silent `.gitignore` shadowing bug that commonly occurs when mixing Python and Node rules in a single repo. Site is verified live on GitHub Pages. |
| **7** | Logic Synchronization & UI Rigor Remediation (City-to-Scorecard Sync, Ventilation Windows, Truncation & Tab Toggles) | 1. **Fixed City-to-Scorecard Sync:** Corrected Berkeley Earth dose formula (converted $22\,\mu\text{g/m}^3$ 24h ambient concentration to $\sim 220\,\mu\text{g}$ daily inhaled mass dose), ensuring clean cities like Bengaluru report realistic values and safe outdoor advice rather than emergency smog lockdowns. 2. **Single Source of Truth for Ventilation:** Derived diurnal curve, chart legend, and hourly routine from `ventilationStartHour`/`ventilationEndHour`. 3. **Fixed Text Truncation:** Expanded atmospheric strip to `xl:grid-cols-6`, removed truncation on atmospheric boundary card, and aligned `Transit/Outdoor` and `Vulnerable Care` rows. 4. **Prominent Tabs & Toggles:** Numbered tabs with adopted count pills and prominent interactive "Adopt Habit" check buttons with real-time recalculations. | Domain physics must differentiate between ambient concentration ($\mu\text{g/m}^3$) and internal pulmonary dose ($\mu\text{g}$). Clean cities now celebrate fresh air while severe cities enforce lockdown protocols. |

---

## 🏛️ 3. Architectural Decisions

- **ADR-01: Atmospheric Civic & Environmental Editorial Design System**
  - *Context:* Generic hackathon templates with neon purples, glowing cyan cards, and floating sparkles undermine serious civic health tools.
  - *Decision:* Clean editorial design system: warm stone/newsprint background (`#F6F5F0`), crisp white elevated panels (`#FFFFFF`) with `1px solid #DCD9D0` borders, deep charcoal ink (`#18201D`), slate secondary (`#52605A`), sage green (`#236B56`) for safe air/impact, warm terracotta (`#C4512C`) for hazardous warnings, and tabular monospace figures (`font-mono tabular-nums`).
  - *Why:* Delivers the credibility of a national meteorological service or investigative climate journalism publication.

- **ADR-02: Deterministic Domain Exposure Engine (`lib/environmentMath.ts`) + Gemini JSON**
  - *Context:* Pure LLM generation for numeric values (inhalation dose, $\text{CO}_2$ emissions, particulate mass) risks unscientific hallucinations, inconsistent math, and erratic toggles.
  - *Decision:* Decouple domain physics from natural language. All quantitative calculations use an auditable TypeScript calculation engine based on peer-reviewed EPA/WHO ventilation rates:
    - Resting: $0.45\text{ m}^3/\text{h}$, Light activity: $0.90\text{ m}^3/\text{h}$, Active exercise: $1.80\text{ m}^3/\text{h}$
    - Infiltration factors: Standard housing $\approx 0.65$, sealed $\approx 0.35$, HEPA-purified room $\approx 0.15$
    - Transport factors: Solo petrol car $\approx 140\text{ g CO}_2/\text{km} + 0.025\text{ g PM}_{2.5}/\text{km}$; Metro/EV $\approx 85\%$ reduction
  - *Why:* Guarantees mathematical integrity while Gemini focuses on qualitative contextual intelligence, personal scheduling, and neighborhood advisories.

- **ADR-03: Offline-Resilient Dual-Mode Architecture & Secret Safety**
  - *Context:* Hackathon demos and live judging can be disrupted by expired API keys, rate-limits, or offline review environments.
  - *Decision:* Next.js API routes with a dual-mode provider: if `GEMINI_API_KEY` is present, it uses Gemini with strict JSON schema outputs; if absent or throttled, it seamlessly switches to an intelligent deterministic fallback synthesizer without throwing errors or showing broken skeletons.

- **ADR-04: Static Export Architecture for GitHub Pages (`github.io`)**
  - *Context:* Deploying full-stack Next.js apps to GitHub Pages requires static HTML/JS export (`output: 'export'`) with repository name subpathing (`basePath: '/vayusaathi-smog-copilot'`).
  - *Decision:* Wired dynamic static export in `next.config.js` via `GITHUB_PAGES=true` environment flag paired with `.github/workflows/deploy.yml`. When hosted statically on GitHub Pages, the app runs the deterministic environmental physics engine and clinical schedule synthesizer directly in the client browser with zero latency.

- **ADR-05: Single Source of Truth for Ventilation Windows & Inhaled Dose Physics**
  - *Context:* Discrepancies between chart tooltips, legend labels, and schedule text destroy trust in civic environmental tools. Furthermore, misinterpreting ambient concentration ($\mu\text{g/m}^3$) as inhaled dose ($\mu\text{g}$) causes clean cities (e.g., Bengaluru AQI 94) to report absurd cigarette equivalences.
  - *Decision:* Standardized `ventilationStartHour` and `ventilationEndHour` in `CitySmogContext` as the single authoritative source for chart highlights, footer notes, and clinical schedule slots. Calibrated cigarette equivalence to $220\,\mu\text{g}$ inhaled particulate mass (Berkeley Earth 24h standard volume), correctly reporting "Clean baseline air: within safe physiological limits" for low-AQI regions.

---

## 📸 4. Screenshot Checklist

- [x] **`01-initial-ui.png`** — Core layout & 24-hour diurnal smog curve render with editorial styling, city presets, and live impact scorecard (`READY TO CAPTURE`).
- [x] **`02-before-fix.png`** — Initial city sync and label truncation edge cases (`DOCUMENTED IN ITERATION 7`).
- [x] **`03-genai-simulator.png`** — Working GenAI tailored plan with live interactive Impact Simulator toggles, synchronized ventilation windows, and community multiplier (`READY TO CAPTURE`).
- [ ] **`04-final-mvp.png`** — Complete polished MVP with RWA Community WhatsApp Bulletin modal.

---
*Log updated in real-time as development progresses.*
