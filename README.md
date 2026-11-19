# Fiverr Gig Guardian — Title Policy & Community Standards Shield

A Manifest V3 browser extension engineered to safeguard Fiverr seller accounts against automated gig denials, policy warnings, and account bans caused by prohibited keywords in gig titles.

---

## 1. Problem Overview & Rationale

Many freelancers copy or adapt titles from established gigs on Fiverr, only to have their new gigs instantly deleted, denied by automated filters, or penalized with a Community Standards strike.

### Why do older gigs survive while new gigs get banned?
- **Grandfathered Legacy Data**: Many existing gigs were published years ago before Fiverr deployed its modern, strict natural language processing (NLP) compliance classifiers.
- **Strict Real-Time Enforcement**: Every newly drafted or updated gig undergoes instant automated screening against Fiverr's updated Community Standards and Prohibited Services guidelines.
- **Copying Trap**: Replicating titles from competitors who used restricted terms (e.g., "homework", "guaranteed profit", "reviews", "whatsapp") results in an immediate flag for new sellers.

**Fiverr Gig Guardian** provides dual-layer protection:
1. **Search & Category Inspector**: Scans every gig card on Fiverr search pages. If an existing gig contains hazardous legacy keywords, it displays a `Policy Hazard` badge and warns you **never to copy it**.
2. **Gig Creation & Edit Live Monitor**: Attaches to the title input in the Fiverr Gig Editor (`manage_gigs/new`). Analyzes text in real-time, highlights forbidden trigger words, cites the exact Fiverr policy rule, and provides a compliant one-click alternative.
3. **Standalone Extension Popup Tester**: Test and refine any gig title before opening Fiverr.

---

## 2. Policy Categories Covered

Fiverr Gig Guardian contains an exhaustive, regularly updated database of Fiverr Community Standards and Prohibited Services:

| Policy Category | Severity | Common Trigger Words | Account Risk |
| :--- | :--- | :--- | :--- |
| **Academic Dishonesty** | `CRITICAL` | `homework`, `assignment`, `coursework`, `dissertation`, `essay writing`, `take my exam` | Permanent ban / Immediate gig removal |
| **Off-Platform Communication** | `CRITICAL` | `whatsapp`, `telegram`, `skype`, `email me`, `call me`, `direct payment`, `paypal` | Warning strike / Account suspension |
| **Fake Reviews & Manipulation** | `CRITICAL` | `google reviews`, `trustpilot reviews`, `buy followers`, `fake traffic`, `boost rating` | Instant gig deletion & seller penalty |
| **Hacking, Exploits & Recovery** | `CRITICAL` | `hack`, `crack`, `keylogger`, `phishing`, `instagram recovery`, `whatsapp hack`, `unban` | Cybercrime flag / Account ban |
| **Pirated Licenses & Copyright** | `CRITICAL` | `canva pro lifetime`, `netflix account`, `windows product key`, `nulled script` | DMCA takedown / Immediate ban |
| **Document Forgery & Identity** | `CRITICAL` | `fake id`, `fake passport`, `bank statement edit`, `doctor note`, `fake diploma` | Legal fraud / Immediate termination |
| **Guaranteed Financial Claims** | `HIGH` | `guaranteed profit`, `100% win rate`, `get rich`, `passive income guarantee` | Misleading services gig rejection |
| **Third-Party ToS & Scraping** | `HIGH` | `scrape emails`, `scrape leads`, `linkedin scraper`, `bulk email sender`, `mass dm` | Third-party terms breach rejection |
| **Uncertified Medical / Legal** | `HIGH` | `cure cancer`, `medical prescription`, `doctor consultation`, `legal representation` | Regulated health violation |
| **Fiverr Brand Impersonation** | `HIGH` | `fiverr choice`, `top rated seller guaranteed`, `official fiverr` | Trademark misrepresentation flag |
| **Unrealistic Guarantees & Syntax** | `MEDIUM` | `100% money back guarantee`, `rank #1 in 24 hours`, `missing "I will"`, `length > 80` | Formatting rejection / dispute risk |

---

## 3. Installation Guide (Chrome / Edge / Brave)

1. Open your browser and navigate to the Extensions page:
   - **Google Chrome**: `chrome://extensions`
   - **Microsoft Edge**: `edge://extensions`
   - **Brave Browser**: `brave://extensions`
2. Enable **Developer mode** (toggle located at the top-right corner).
3. Click the **Load unpacked** button.
4. Select the project directory:
   ```text
   D:\Projects\fiverr-gig-guardian
   ```
5. The extension will appear with the active status and the Fiverr Shield icon in your toolbar.

---

## 4. Key Features & How to Use

### A. Browsing Fiverr Search Results
- When you search for any niche on Fiverr (e.g., `fiverr.com/search/gigs?query=python`), each gig card displays a compliance badge:
  - `Compliant` (Green): Safe to analyze for inspiration.
  - `Policy Hazard` (Red) / `High Risk` (Orange): Contains banned terms. Hover your mouse over the badge to see which words are hazardous and why you must not copy them.

### B. Creating or Editing a Gig on Fiverr
- Navigate to `fiverr.com/manage_gigs/new` or open an existing gig in edit mode.
- Below the **Gig Title** field, the **Fiverr Policy Guardian** live panel activates automatically.
- As you type:
  - Real-time character counter monitors length (optimal: 40–70 chars, max: 80 chars).
  - Flags any prohibited word instantly before you save.
  - Provides a one-click **Apply Safe Title** button that replaces forbidden terms with compliant professional wording.

### C. Extension Popup Inspector
- Click the extension icon in your browser toolbar anytime.
- Paste any drafted title to instantly view:
  - Overall Compliance Score (0/100 to 100/100).
  - Detected policy violations.
  - Safe rephrasing alternative.

---

## 5. Technical Architecture

```text
fiverr-gig-guardian/
├── manifest.json                  # Manifest V3 configuration & permissions
├── icons/                         # 16, 32, 48, 128px high-DPI shield icons
├── rules/
│   └── policy-database.js         # Regulatory database: 11 policy categories & regex patterns
├── core/
│   └── risk-engine.js             # Risk evaluation engine, scoring, & rephrasing generator
├── content/
│   ├── content.js                 # MutationObserver DOM scanner & live editor monitor
│   └── content.css                # Institutional dark design (Linear/Raycast style)
├── popup/
│   ├── popup.html                 # Extension action UI (Inspector, Policy Catalog, Settings)
│   ├── popup.css                  # High-precision styling
│   └── popup.js                   # Popup controller & state management
├── background/
│   └── service-worker.js          # Service worker for default settings & lifecycle
├── .gitignore
└── README.md
```

---

## 6. License & Author
- **Developer**: Muhammad Hassan ([GitHub](https://github.com/MuhammadHassanC))
- **Organization**: Algenza Labs
- **Compliance Scope**: Fiverr Community Standards (Updated November 2026)
