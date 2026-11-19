# Fiverr Gig Guardian — Title Policy & Community Standards Shield (v2.1)

A Manifest V3 browser extension engineered to safeguard Fiverr seller accounts against automated gig denials, policy warnings, and account bans caused by prohibited keywords in gig titles.

---

## 1. Overview

Many freelancers copy or adapt titles from established gigs on Fiverr, only to have their new gigs instantly deleted, denied by automated filters, or penalized with a Community Standards strike.

### Why do older gigs survive while new gigs get banned?
- **Grandfathered Data**: Many existing gigs were published years ago before Fiverr deployed its modern, strict natural language processing compliance classifiers.
- **Strict Real-Time Enforcement**: Every newly drafted or updated gig undergoes instant automated screening against Fiverr's updated Community Standards and Prohibited Services guidelines.
- **Copying Trap**: Replicating titles from competitors who used restricted terms (e.g., "pass prop firm", "profitable ea", "homework", "reviews", "whatsapp") results in an immediate flag for new sellers.

**Fiverr Gig Guardian (v2.1)** provides clean, minimal protection:
1. **Simple Inline Title Tags**:
   - A clean, small tag (`Safe`, `Caution`, `Risk`, `Danger`) placed directly at the end of the gig title text.
   - Zero image overlays or visual clutter.
   - Hovering over the tag displays a small floating card with exact flagged words, the violated Fiverr rule, and safe rephrasing suggestions.
2. **Gig Creation & Edit Live Monitor**: Attaches to the title input in the Fiverr Gig Editor (`manage_gigs/new`). Analyzes text in real-time, highlights forbidden trigger words, cites the exact Fiverr policy rule, and provides a compliant one-click alternative.
3. **Standalone Extension Popup Tester**: Test and refine any gig title before opening Fiverr.

---

## 2. Policy Categories Covered

Fiverr Gig Guardian contains an exhaustive database of Fiverr Community Standards and Prohibited Services:

| Policy Category | Severity | Common Trigger Words | Account Risk |
| :--- | :--- | :--- | :--- |
| **Prop Firm Passing & HFT Bot Cheating** | `CRITICAL` | `pass prop firm`, `ftmo pass`, `hft prop firm`, `funded account pass`, `prop firm bot` | Mass ban crackdown / Financial fraud flag |
| **Decompilation, Cracking & IP Theft** | `CRITICAL` | `decompile`, `ex4 to mq4`, `ex5 to mq5`, `remove ea license`, `crack ea`, `clone ea` | Permanent account ban / IP theft |
| **Unlicensed Account & Signal Management**| `CRITICAL` | `forex account management`, `fund management`, `copy trading service`, `forex signals` | Regulatory violation / Account strike |
| **Academic Dishonesty** | `CRITICAL` | `homework`, `assignment`, `coursework`, `dissertation`, `essay writing`, `take my exam` | Permanent ban / Immediate gig removal |
| **Off-Platform Communication** | `CRITICAL` | `whatsapp`, `telegram`, `skype`, `email me`, `call me`, `direct payment`, `paypal` | Warning strike / Account suspension |
| **Fake Reviews & Manipulation** | `CRITICAL` | `google reviews`, `trustpilot reviews`, `buy followers`, `fake traffic`, `boost rating` | Instant gig deletion & seller penalty |
| **Hacking, Exploits & Recovery** | `CRITICAL` | `hack`, `crack`, `keylogger`, `phishing`, `instagram recovery`, `whatsapp hack`, `unban` | Cybercrime flag / Account ban |
| **Guaranteed Profits & Accuracy Claims** | `HIGH` | `profitable ea`, `profitable bot`, `guaranteed profit`, `100% win rate`, `no loss` | Misleading services gig rejection |
| **Binary Options & High-Risk Derivatives** | `HIGH` | `binary bot`, `deriv bot`, `pocket option bot`, `quotex bot`, `iq option bot` | Gambling & unregulated derivatives flag |
| **Third-Party ToS & Scraping** | `HIGH` | `scrape emails`, `scrape leads`, `linkedin scraper`, `bulk email sender`, `mass dm` | Third-party terms breach rejection |
| **Pirated Licenses & Copyright** | `CRITICAL` | `canva pro lifetime`, `netflix account`, `windows product key`, `nulled script` | DMCA takedown / Immediate ban |
| **Document Forgery & Identity** | `CRITICAL` | `fake id`, `fake passport`, `bank statement edit`, `doctor note`, `fake diploma` | Legal fraud / Immediate termination |
| **Keyword Stuffing & Synonym Redundancy** | `MEDIUM` | Stacking `bot + expert advisor + ea + eas` or `mt4 + mt5 + ea + bot + indicator` | Editorial rejection ("repetitive keywords") |
| **Unrealistic Guarantees & Syntax** | `MEDIUM` | `100% money back guarantee`, `rank #1 in 24 hours`, `missing "I will"`, `length > 80` | Formatting rejection / dispute risk |

---

## 3. Installation Guide (Chrome / Edge / Brave)

1. Open your browser and navigate to the Extensions page:
   - **Google Chrome**: `chrome://extensions`
   - **Microsoft Edge**: `edge://extensions`
   - **Brave Browser**: `brave://extensions`
2. Enable **Developer mode** (toggle located at the top-right corner).
3. If previously loaded, click the **Reload icon (↻)** on the Fiverr Gig Guardian card, or click **Load unpacked** and select:
   ```text
   D:\Projects\fiverr-gig-guardian
   ```
4. Refresh your Fiverr page.

---

## 4. License & Author
- **Developer**: Muhammad Hassan ([GitHub](https://github.com/MuhammadHassanC))
- **Organization**: Algenza Labs
