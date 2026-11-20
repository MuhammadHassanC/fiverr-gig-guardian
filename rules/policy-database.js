/**
 * Fiverr Policy & Community Guidelines Database
 * High-precision regulatory rule set mapping prohibited keywords, regex patterns,
 * severity weights, and official Fiverr Community Standards references.
 * Version: 2026.11.5
 * 100% Deterministic — Evaluates code modification, keyword stuffing, and ToS risks.
 */

const FIVERR_POLICY_DATABASE = {
  version: "2026.11.5",
  lastUpdated: "2026-11-20",
  categories: {
    // 1. PROP FIRM CHEATING (CRITICAL - Instant Account Suspension)
    PROP_FIRM_CHEATING: {
      id: "PROP_FIRM_CHEATING",
      name: "Prop Firm Challenge Passing",
      severity: "CRITICAL",
      fiverrRule: "Prohibited Financial Services & Academic/Financial Cheating Policy",
      description: "Fiverr strictly bans offering to pass prop firm challenges (FTMO, MFF, etc.) using automated HFT bots or account passing services.",
      safeAlternative: "Offer risk management consultation or custom algorithmic strategy coding for personal trading.",
      keywords: [
        "pass prop firm", "prop firm pass", "pass ftmo", "ftmo pass",
        "hft prop firm", "pass funded account", "funded account pass",
        "prop firm challenge pass", "mff pass", "fundednext pass",
        "prop firm passing bot", "hft passing bot", "ftmo passing bot",
        "pass prop firm challenge", "pass funded challenge"
      ],
      patterns: [
        /\b(pass|passing)\s+.*?\b(prop\s*firm|ftmo|mff|funded\s*account|funded\s*challenge|prop\s*challenge)\b/i,
        /\b(hft\s+prop\s*firm|pass\s+ftmo|pass\s+funded)\b/i
      ]
    },

    // 2. UNLICENSED FINANCIAL MANAGEMENT & SIGNALS (CRITICAL - Regulatory Breach)
    UNLICENSED_FINANCIAL_MANAGEMENT: {
      id: "UNLICENSED_FINANCIAL_MANAGEMENT",
      name: "Unlicensed Account Management & Signals",
      severity: "CRITICAL",
      fiverrRule: "Financial Disclaimers & Unlicensed Financial Management Policy",
      description: "Managing other people's trading accounts or selling uncertified financial signals violates financial regulations and Fiverr ToS.",
      safeAlternative: "Focus exclusively on software development (e.g. 'build custom MT5 indicator', 'code automated strategy script').",
      keywords: [
        "forex account management", "manage your account", "trade for you",
        "copy trade service", "copy trading service", "investment management",
        "forex signals", "vip signals", "crypto signals", "daily signals",
        "trading signals", "telegram signals", "signals group", "sure win signals"
      ],
      patterns: [
        /\b(forex|crypto|trading)\s+.*?\b(account\s+management|fund\s+management)\b/i,
        /\b(manage\s+your\s+(forex|crypto|trading)\s+account)\b/i,
        /\b(vip|daily|sure\s*win|telegram)\s+.*?\b(signals|signal\s+group)\b/i,
        /\b(copy\s+trading\s+service)\b/i
      ]
    },

    // 3. DECOMPILATION, CRACKING & IP THEFT (CRITICAL - Permanent Ban)
    DECOMPILATION_IP_THEFT: {
      id: "DECOMPILATION_IP_THEFT",
      name: "Decompilation, EA Cracking & IP Theft",
      severity: "CRITICAL",
      fiverrRule: "Intellectual Property Rights, Software Cracking & Reverse Engineering",
      description: "Offering to decompile (.ex4/.ex5), reverse engineer, remove licensing locks, or crack commercial EAs/indicators results in permanent account suspension.",
      safeAlternative: "Build custom strategies from scratch based on user rules or open-source trading logic.",
      keywords: [
        "decompile", "decompiling", "decompilation", "ex4 to mq4", "ex5 to mq5",
        "reverse engineer ea", "remove ea license", "remove license lock",
        "bypass ea lock", "crack ea", "cracked ea", "bypass dll",
        "unlock ea", "decompile expert advisor", "steal source code"
      ],
      patterns: [
        /\b(decompile|decompiling|decompilation)\b/i,
        /\b(ex[45]\s+to\s+mq[45])\b/i,
        /\b(remove|bypass|unlock)\s+.*?\b(ea\s+license|ea\s+lock|dll\s+protection)\b/i,
        /\b(reverse\s+engineer)\s+.*?\b(ea|indicator|bot|software|code)\b/i
      ]
    },

    // 4. GUARANTEED PROFITS & UNREALISTIC ACCURACY CLAIMS (HIGH RISK)
    GUARANTEED_FINANCIAL_CLAIMS: {
      id: "GUARANTEED_FINANCIAL_CLAIMS",
      name: "Guaranteed Profits & Accuracy Claims",
      severity: "HIGH",
      fiverrRule: "Misleading Services & False Commercial Guarantees Policy",
      description: "Promising guaranteed financial returns, 'profitable ea', or '100% win rate' triggers automated gig rejection during review.",
      safeAlternative: "Use technical phrasing: 'backtested quantitative strategy', 'risk-managed algorithmic EA', 'rule-based trading system'.",
      keywords: [
        "profitable ea", "profitable bot", "profitable trading bot",
        "guaranteed profit", "100% win rate", "99% win rate", "95% win rate",
        "no loss bot", "zero loss ea", "holy grail ea",
        "get rich", "guaranteed sales", "make money fast", "guaranteed roi",
        "passive income guarantee", "risk free profit", "automated profit", "sure profit"
      ],
      patterns: [
        /\b(profitable)\s+.*?\b(ea|bot|trading\s*bot|expert\s*advisor|robot|strategy)\b/i,
        /\b(guaranteed|risk[- ]free|sure)\s+.*?\b(profit|profits|roi|return|income|win\s*rate|winning)\b/i,
        /\b(100%|99%|98%|95%)\s+.*?\b(win\s*rate|winning|accuracy)\b/i,
        /\b(no\s+loss|zero\s+loss)\s+.*?\b(bot|ea|trading)\b/i
      ]
    },

    // 5. ACADEMIC DISHONESTY & HOMEWORK (CRITICAL - Instant Strike)
    ACADEMIC_DISHONESTY: {
      id: "ACADEMIC_DISHONESTY",
      name: "Academic Dishonesty & Homework Cheating",
      severity: "CRITICAL",
      fiverrRule: "Academic Services & Homework Assistance Policy",
      description: "Fiverr strictly prohibits doing homework, writing essays, preparing dissertations, or taking exams/quizzes on behalf of students.",
      safeAlternative: "Offer tutoring, conceptual guidance, thesis formatting, or proofreading instead of doing the student's work.",
      keywords: [
        "homework", "do my homework", "homework help", "write my essay", "essay writing service",
        "essay writer", "write essay", "college essay", "school essay", "academic paper",
        "term paper", "dissertation writing", "thesis writing", "phd thesis", "take my exam",
        "take my test", "solve exam", "solve quiz", "exam help", "quiz help", "test help",
        "pass my exam", "assignment help", "do my assignment", "complete my assignment",
        "coursework writing", "do homework", "solve my exam", "write my assignment"
      ],
      patterns: [
        /\b(write|do|complete|solve|help\s+with)\s+.*?\b(homework|assignment|coursework|thesis|dissertation|essay|exam|quiz)\b/i,
        /\b(academic\s+(paper|writing|research\s+paper))\b/i,
        /\b(take|pass)\s+(my\s+)?(exam|test|quiz)\b/i,
        /\b(essay\s+(writer|writing|service))\b/i,
        /\b(homework\s+help|assignment\s+help|exam\s+help|quiz\s+help)\b/i
      ]
    },

    // 6. OFF-PLATFORM CONTACT & PAYMENTS (CRITICAL - Instant Strike)
    OFF_PLATFORM_COMMUNICATION: {
      id: "OFF_PLATFORM_COMMUNICATION",
      name: "Off-Platform Contact & Payments",
      severity: "CRITICAL",
      fiverrRule: "Off-Platform Communication & Payment Terms",
      description: "Soliciting contact details, external messengers, or outside payments violates core Fiverr Terms of Service.",
      safeAlternative: "Keep all communication and order files inside Fiverr inbox and order chat.",
      keywords: [
        "whatsapp", "contact on whatsapp", "chat on whatsapp", "message on whatsapp", "call on whatsapp",
        "whatsapp me", "contact on telegram", "chat on telegram", "message on telegram", "telegram handle",
        "telegram username", "skype me", "phone number", "call me", "zoom meeting", "google meet",
        "email me", "direct payment", "pay outside", "paypal payment", "crypto transfer", "cashapp",
        "zelle", "wire transfer", "usdt payment", "off platform", "reach me at", "inbox outside",
        "contact outside", "contact me on", "viber", "signal app"
      ],
      patterns: [
        /\b(chat|contact|message|call|reach|talk)\s+.*?\b(outside|whatsapp|telegram|skype|zoom|email|phone)\b/i,
        /\b(pay|payment)\s+.*?\b(outside|directly|paypal|crypto|zelle|cashapp|usdt)\b/i,
        /\b(whatsapp\s*(number|me|chat|message))\b/i,
        /\b(telegram\s*(username|handle|id|contact))\b/i,
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i,
        /\b(\+?[0-9]{10,14})\b/i
      ]
    },

    // 7. FAKE REVIEWS & METRIC MANIPULATION (CRITICAL)
    FAKE_REVIEWS_MANIPULATION: {
      id: "FAKE_REVIEWS_MANIPULATION",
      name: "Fake Reviews & Metric Manipulation",
      severity: "CRITICAL",
      fiverrRule: "Feedback & Reviews Manipulation Standards",
      description: "Offering to write, sell, or purchase reviews, ratings, or simulated vanity metrics is strictly forbidden.",
      safeAlternative: "Offer authentic QA testing, user experience audit, or white-hat organic promotion.",
      keywords: [
        "fake review", "fake reviews", "google reviews", "trustpilot reviews",
        "app reviews", "product reviews", "yelp reviews", "play store reviews",
        "amazon review", "boost rating", "5 star review", "positive reviews",
        "buy reviews", "buy followers", "buy likes", "buy views",
        "buy subscribers", "fake traffic", "bot traffic", "boost follower",
        "boost subscriber", "google maps review", "tripadvisor review",
        "app store review", "positive feedback", "5 star rating"
      ],
      patterns: [
        /\b(5\s*star|positive|google|trustpilot|amazon|yelp|play\s*store|app\s*store)\s+.*?\b(review|reviews|rating|ratings|feedback)\b/i,
        /\b(buy|sell|get|boost)\s+.*?\b(reviews|ratings|followers|likes|views|subscribers)\b/i,
        /\b(fake|bot)\s+.*?\b(traffic|views|clicks|visitors|feedback|reviews)\b/i
      ]
    },

    // 8. HACKING & EXPLOITS (CRITICAL)
    HACKING_EXPLOITS_RECOVERY: {
      id: "HACKING_EXPLOITS_RECOVERY",
      name: "Hacking, Exploits & Account Recovery",
      severity: "CRITICAL",
      fiverrRule: "Prohibited Services - Malicious Software & Account Access",
      description: "Any service offering account recovery, password cracking, surveillance, or unauthorized access is treated as cybercrime/fraud.",
      safeAlternative: "Offer certified cybersecurity consultation, vulnerability scanning, or code auditing with formal agreement.",
      keywords: [
        "hack website", "hack account", "hacker for hire", "hire a hacker", "instagram hack",
        "whatsapp hack", "facebook hack", "password crack", "crack password", "wifi hack",
        "keylogger", "spyware", "phishing", "ddos", "botnet", "malware",
        "recover instagram account", "unban instagram", "recover facebook account", "crypto recovery",
        "wallet recovery", "recover disabled account", "bypass login", "spy phone", "password cracker"
      ],
      patterns: [
        /\b(hack|crack)\s+.*?\b(account|password|website|database|instagram|facebook|whatsapp|wifi|login|security)\b/i,
        /\b(recover|unban|restore|unlock)\s+.*?\b(instagram|facebook|whatsapp|tiktok|crypto|wallet|twitter|account|disabled\s+account)\b/i,
        /\b(spyware|keylogger|phishing|trojan|botnet|ddos\s+attack)\b/i,
        /\b(hire\s+(a\s+)?hacker|hacker\s+for\s+hire)\b/i
      ]
    },

    // 9. BINARY OPTIONS & UNREGULATED GAMBLING (HIGH RISK)
    BINARY_OPTIONS_BOTS: {
      id: "BINARY_OPTIONS_BOTS",
      name: "Binary Options & Unregulated Bots",
      severity: "HIGH",
      fiverrRule: "High-Risk Derivatives & Gambling Automation Policy",
      description: "Binary options platforms are classified as financial gambling in multiple jurisdictions; bots targeting them face heavy compliance rejections.",
      safeAlternative: "Develop EAs for regulated spot forex or futures markets (MetaTrader, TradingView, NinjaTrader).",
      keywords: [
        "binary bot", "binary options bot", "deriv bot", "pocket option bot",
        "quotex bot", "iq option bot", "binary trading bot", "pocket option ea",
        "quotex signals", "deriv binary bot"
      ],
      patterns: [
        /\b(binary\s+options?|deriv|pocket\s*option|quotex|iq\s*option)\s+.*?\b(bot|ea|signals?|automation)\b/i
      ]
    },

    // 10. THIRD-PARTY TOS & DATA SCRAPING (HIGH RISK)
    THIRD_PARTY_TOS_SCRAPING: {
      id: "THIRD_PARTY_TOS_SCRAPING",
      name: "Third-Party ToS Violations & Data Scraping",
      severity: "HIGH",
      fiverrRule: "Third-Party Platform Terms & Intellectual Rights",
      description: "Extracting private personal data (PII) or enabling mass automated spamming against other platforms breaches Fiverr standards.",
      safeAlternative: "Frame as B2B lead generation from public directories, custom API integrations, or market research.",
      keywords: [
        "scrape emails", "scrape phone numbers", "scrape leads", "scrape contacts",
        "email scraper", "lead scraper", "linkedin scraper", "scrape linkedin",
        "scrape instagram", "scrape yellowpages", "scrape google maps contacts",
        "bulk email sender", "mass dm", "mass mailer", "bypass captcha", "account farm"
      ],
      patterns: [
        /\b(scrape|scraper|scraping|extract|harvest)\s+.*?\b(emails?|phone\s*numbers?|leads?|contacts?|pii)\b/i,
        /\b(bulk|mass)\s+.*?\b(emails?|mail|dms?|messages?|whatsapp\s*messages?)\b/i,
        /\b(bypass\s+captcha)\b/i
      ]
    },

    // 11. PIRATED LICENSES & COPYRIGHT (CRITICAL)
    COPYRIGHT_PIRACY_LICENSES: {
      id: "COPYRIGHT_PIRACY_LICENSES",
      name: "Pirated Licenses & Copyright Reselling",
      severity: "CRITICAL",
      fiverrRule: "Intellectual Property Rights & Digital Goods Reselling",
      description: "Reselling cracked digital software, private keys, or illicit shared enterprise subscriptions triggers automated DMCA bans.",
      safeAlternative: "Sell custom design services, theme customization, or legitimate official setup assistance.",
      keywords: [
        "canva pro lifetime", "netflix account", "spotify lifetime",
        "windows product key", "office 365 lifetime", "nulled",
        "cracked script", "adobe creative cloud crack", "free license key",
        "sell iptv", "iptv subscription", "cracked plugin", "gpl cracked"
      ],
      patterns: [
        /\b(canva\s*pro|netflix|spotify|office\s*365|windows\s*1[01])\s+.*?\b(lifetime|account|cheap|crack|key|license)\b/i,
        /\b(nulled|cracked|warez)\s+(script|theme|plugin|code|bot)\b/i,
        /\b(iptv\s+.*?(stream|subscription|service|channels))\b/i
      ]
    },

    // 12. FORGERY & FAKE DOCUMENTS (CRITICAL)
    FORGERY_FAKE_DOCUMENTS: {
      id: "FORGERY_FAKE_DOCUMENTS",
      name: "Document Forgery & Fake Identity",
      severity: "CRITICAL",
      fiverrRule: "Fraud & Identity Misrepresentation Policy",
      description: "Creating or altering official legal, financial, or academic documents is severe marketplace fraud.",
      safeAlternative: "Offer graphic design templates or professional resume formatting with clear disclaimer.",
      keywords: [
        "fake id", "fake passport", "fake certificate", "diploma maker",
        "bank statement edit", "utility bill edit", "doctor note",
        "fake receipt", "driver license edit", "ssn edit", "fake diploma",
        "novelty document", "edit bank statement", "edit paystub"
      ],
      patterns: [
        /\b(fake|counterfeit|novelty)\s+(id|passport|diploma|certificate|license|document)\b/i,
        /\b(edit|modify)\s+.*?\b(bank\s+statement|paystub|utility\s+bill|invoice|receipt|document)\b/i
      ]
    },

    // 13. CODE MODIFICATION & REVERSE ENGINEERING RISK (HIGH RISK)
    CODE_MODIFICATION_IP_RISK: {
      id: "CODE_MODIFICATION_IP_RISK",
      name: "EA / Code Modification & IP Scrutiny",
      severity: "HIGH",
      fiverrRule: "Intellectual Property Rights & Code Modification Policy",
      description: "Offering to 'modify' existing EAs, indicators, or compiled trading bots triggers Fiverr editorial review for reverse engineering and decompilation risks.",
      safeAlternative: "Offer custom strategy coding or indicator development from scratch.",
      keywords: [
        "modify ea", "modify indicator", "modify mt4", "modify mt5", "modify bot",
        "modify expert advisor", "edit ea", "edit indicator", "edit expert advisor",
        "ea modification", "bot modification", "indicator modification"
      ],
      patterns: [
        /\b(modify|modifying|edit|editing)\b.*?\b(mt[45]|ea|eas|expert\s*advisor|indicator|trading\s*bot|bot|robot)\b/i,
        /\b(mt[45]|ea|eas|expert\s*advisor|indicator|bot)\b.*?\b(modification|modifying)\b/i
      ]
    },

    // 14. REPETITIVE KEYWORD STUFFING (MEDIUM RISK - Gig Disapproval)
    KEYWORD_STUFFING_REDUNDANCY: {
      id: "KEYWORD_STUFFING_REDUNDANCY",
      name: "Keyword Stuffing & Redundant Synonyms",
      severity: "MEDIUM",
      fiverrRule: "Gig Title Quality & Editorial Guidelines",
      description: "Fiverr rejects new gigs that repeat synonyms (e.g. 'bot', 'expert advisor', 'ea', 'trading bot'). Legacy gigs created years ago keep them, but new gigs get denied.",
      safeAlternative: "Choose ONE primary clear term: e.g. 'I will develop a custom MT5 Expert Advisor' instead of stacking 'bot ea expert advisor'.",
      keywords: [],
      patterns: []
    }
  },

  syntaxRules: {
    prefixRule: {
      pattern: /^i\s+will\b/i,
      message: "Gig title must strictly begin with 'I will'."
    },
    maxLength: 80,
    optimalMinLength: 40,
    optimalMaxLength: 70,
    disallowedCharacters: /[!?;:*^~_`|<>{}()[\]]/g,
    repeatedKeywordLimit: 3
  }
};

// Export for Chrome Extension modules / content scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = FIVERR_POLICY_DATABASE;
}
