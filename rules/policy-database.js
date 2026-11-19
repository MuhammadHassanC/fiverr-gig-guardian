/**
 * Fiverr Policy & Community Guidelines Database
 * High-precision regulatory rule set mapping prohibited keywords, regex patterns,
 * severity weights, and official Fiverr Community Standards references.
 * Updated: November 2026 (Includes Trading / EA / Prop Firm / Bot Specializations)
 */

const FIVERR_POLICY_DATABASE = {
  version: "2026.11.2",
  lastUpdated: "2026-11-19",
  categories: {
    // 1. PROP FIRM CHEATING & ACCOUNT MANAGEMENT (CRITICAL - Instant Ban)
    PROP_FIRM_CHEATING_MANAGEMENT: {
      id: "PROP_FIRM_CHEATING_MANAGEMENT",
      name: "Prop Firm Passing & Account Management",
      severity: "CRITICAL",
      fiverrRule: "Prohibited Financial Services & Academic/Financial Cheating Policy",
      description: "Fiverr strictly bans offering to pass prop firm challenges (FTMO, MFF, etc.) using automated HFT bots, account management, or third-party trading on client accounts.",
      safeAlternative: "Offer risk management consultation, algorithmic backtesting, or custom strategy coding for personal accounts.",
      keywords: [
        "pass prop firm", "prop firm pass", "pass ftmo", "ftmo pass",
        "hft prop firm", "prop firm bot", "pass funded account",
        "funded account pass", "prop firm challenge pass", "mff pass",
        "fundednext pass", "pass evaluation", "evaluation pass",
        "prop firm passing bot", "hft passing bot", "pass your prop firm",
        "prop firm ea", "ftmo passing bot"
      ],
      patterns: [
        /\b(pass|passing)\s+.*?\b(prop\s*firm|ftmo|mff|funded\s*account|challenge|evaluation)\b/i,
        /\b(prop\s*firm|ftmo)\s+.*?\b(pass|passing|bot|ea)\b/i,
        /\b(hft\s+prop\s*firm\s+bot)\b/i
      ]
    },

    // 2. UNLICENSED FINANCIAL MANAGEMENT & SIGNALS (CRITICAL - Regulatory Violation)
    UNLICENSED_FINANCIAL_MANAGEMENT: {
      id: "UNLICENSED_FINANCIAL_MANAGEMENT",
      name: "Unlicensed Account Management & Trading Signals",
      severity: "CRITICAL",
      fiverrRule: "Financial Disclaimers & Unlicensed Financial Management Policy",
      description: "Managing other people's trading accounts, offering pooled funds, or selling uncertified financial signals violates international financial regulations and Fiverr ToS.",
      safeAlternative: "Focus exclusively on software development (e.g. 'build custom MT5 indicator', 'code automated strategy script').",
      keywords: [
        "forex account management", "account management", "fund management",
        "manage your account", "trade for you", "copy trade service",
        "copy trading service", "investment management", "forex signals",
        "vip signals", "crypto signals", "daily signals", "trading signals",
        "telegram signals", "signals group", "binary signals", "sure win signals"
      ],
      patterns: [
        /\b(forex|crypto|trading)\s+.*?\b(account\s+management|fund\s+management)\b/i,
        /\b(manage\s+your\s+(forex|crypto|trading)\s+account)\b/i,
        /\b(vip|daily|sure\s*win|telegram)\s+.*?\b(signals|signal\s+group)\b/i,
        /\b(copy\s+trading\s+service)\b/i
      ]
    },

    // 3. DECOMPILATION, CRACKING & IP THEFT (CRITICAL - Permanent Account Ban)
    DECOMPILATION_IP_THEFT: {
      id: "DECOMPILATION_IP_THEFT",
      name: "Decompilation, EA Cracking & IP Theft",
      severity: "CRITICAL",
      fiverrRule: "Intellectual Property Rights, Software Cracking & Reverse Engineering",
      description: "Offering to decompile (.ex4/.ex5), reverse engineer, remove licensing locks, or clone protected commercial EAs/indicators results in permanent account suspension.",
      safeAlternative: "Build custom strategies from scratch based on user rules or open-source trading logic.",
      keywords: [
        "decompile", "decompiling", "decompilation", "ex4 to mq4", "ex5 to mq5",
        "reverse engineer ea", "remove ea license", "remove license lock",
        "bypass ea lock", "crack ea", "cracked ea", "bypass dll",
        "unlock ea", "decompile expert advisor", "clone indicator",
        "clone ea", "rip indicator", "steal source code"
      ],
      patterns: [
        /\b(decompile|decompiling|decompilation)\b/i,
        /\b(ex[45]\s+to\s+mq[45])\b/i,
        /\b(remove|bypass|unlock)\s+.*?\b(license|ea\s+lock|dll\s+protection|protection)\b/i,
        /\b(reverse\s+engineer)\s+.*?\b(ea|indicator|bot|software|code)\b/i
      ]
    },

    // 4. GUARANTEED PROFITS & MISLEADING ACCURACY CLAIMS (HIGH RISK)
    GUARANTEED_FINANCIAL_CLAIMS: {
      id: "GUARANTEED_FINANCIAL_CLAIMS",
      name: "Guaranteed Profits & Accuracy Claims",
      severity: "HIGH",
      fiverrRule: "Misleading Services & False Commercial Guarantees Policy",
      description: "Using words like 'profitable ea', 'guaranteed profit', '99% win rate', or 'no loss' triggers automated gig denial during editorial review.",
      safeAlternative: "Use technical phrasing: 'backtested quantitative strategy', 'risk-managed algorithmic EA', 'rule-based trading system'.",
      keywords: [
        "profitable ea", "profitable bot", "profitable trading bot",
        "guaranteed profit", "100% win rate", "99% win rate", "95% win rate",
        "90% win rate", "no loss", "zero loss", "holy grail ea",
        "get rich", "guaranteed sales", "make money fast", "guaranteed roi",
        "passive income guarantee", "risk free profit", "high accuracy bot",
        "high accuracy ea", "automated profit", "sure profit"
      ],
      patterns: [
        /\b(profitable)\s+(ea|bot|trading\s*bot|expert\s*advisor|robot)\b/i,
        /\b(guaranteed|risk[- ]free|sure)\s+.*?\b(profit|profits|roi|return|income|win\s*rate|winning)\b/i,
        /\b(100%|99%|98%|95%|90%)\s+.*?\b(win\s*rate|winning|accuracy|profitable)\b/i,
        /\b(no\s+loss|zero\s+loss|zero\s+drawdown)\b/i
      ]
    },

    // 5. ACADEMIC DISHONESTY & HOMEWORK (CRITICAL - Instant Strike)
    ACADEMIC_DISHONESTY: {
      id: "ACADEMIC_DISHONESTY",
      name: "Academic Dishonesty & School Work",
      severity: "CRITICAL",
      fiverrRule: "Academic Services & Homework Assistance Policy",
      description: "Fiverr strictly prohibits doing homework, writing essays, preparing dissertations, or taking tests on behalf of students.",
      safeAlternative: "Offer tutoring, conceptual guidance, thesis formatting, or proofreading instead of doing the work.",
      keywords: [
        "homework", "assignment", "coursework", "dissertation", "thesis",
        "essay writing", "write my essay", "do my homework", "academic paper",
        "school project", "university paper", "take my exam", "quiz", "midterm",
        "final exam", "phd thesis", "term paper", "academic writing",
        "college essay", "school essay", "write essay", "essay writer",
        "assignment help", "homework help", "solve exam", "solve quiz",
        "exam help", "quiz help", "test help"
      ],
      patterns: [
        /\b(write|do|complete|solve|help\s+with)\s+.*?\b(homework|assignment|coursework|thesis|dissertation|essay|exam|quiz)\b/i,
        /\b(academic\s+(paper|writing|project|work|research))\b/i,
        /\b(pass|take)\s+(my\s+)?(exam|test|quiz)\b/i,
        /\b(essay\s+(writer|writing|service))\b/i
      ]
    },

    // 6. OFF-PLATFORM CONTACT & EXTERNAL MESSAGING (CRITICAL - Instant Strike)
    OFF_PLATFORM_COMMUNICATION: {
      id: "OFF_PLATFORM_COMMUNICATION",
      name: "Off-Platform Contact & Payments",
      severity: "CRITICAL",
      fiverrRule: "Off-Platform Communication & Payment Terms",
      description: "Soliciting contact details, external messengers, or outside payments violates core Fiverr Terms of Service.",
      safeAlternative: "Keep all communication and order files inside Fiverr inbox and order chat.",
      keywords: [
        "whatsapp", "telegram", "skype", "phone number", "call me",
        "zoom meeting", "google meet", "email me", "gmail", "yahoo mail",
        "direct payment", "pay outside", "paypal payment", "crypto transfer",
        "cashapp", "zelle", "wire transfer", "direct transfer", "usdt payment",
        "off platform", "reach me at", "inbox outside", "contact outside",
        "contact me on", "chat on whatsapp", "chat on telegram", "wechat",
        "viber", "signal app"
      ],
      patterns: [
        /\b(whatsapp|telegram|skype|zoom|wechat|signal|viber)\b/i,
        /\b(call|contact|message|reach)\s+.*?\b(outside|whatsapp|telegram|email|phone)\b/i,
        /\b(pay|payment)\s+.*?\b(outside|directly|paypal|crypto|zelle|cashapp|usdt)\b/i,
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
        "boost subscriber", "google maps review", "tripadvisor review"
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
        "hack", "hacker", "hacking", "crack", "cracking",
        "keylogger", "phishing", "ddos", "botnet", "spyware",
        "malware", "cheat engine", "game cheat", "bypass security",
        "recover account", "unban account", "instagram recovery",
        "whatsapp hack", "facebook recovery", "crypto recovery",
        "wallet recovery", "hack website", "bypass login", "spy phone",
        "sniff traffic", "password cracker", "account unban", "recover disabled account"
      ],
      patterns: [
        /\b(hack|hacker|hacking|crack|cracking|cracked)\b/i,
        /\b(recover|unban|restore|unlock)\s+.*?\b(instagram|facebook|whatsapp|tiktok|crypto|wallet|twitter|account|page)\b/i,
        /\b(spy|spyware|keylogger|phishing|trojan|botnet|ddos)\b/i
      ]
    },

    // 9. BINARY OPTIONS & HIGH-RISK DERIVATIVES (HIGH RISK)
    BINARY_OPTIONS_BOTS: {
      id: "BINARY_OPTIONS_BOTS",
      name: "Binary Options & Unregulated Trading Bots",
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
        "scrape emails", "scrape phone numbers", "scrape leads",
        "linkedin scraper", "bulk email sender", "mass dm", "spam messages",
        "bypass captcha", "account farm", "auto create accounts",
        "scraping tool", "lead scraper", "scrape instagram", "scrape yellowpages",
        "scrape google maps", "mass whatsapp sender", "scraper", "scraping",
        "bulk email", "bulk mail", "mass mailer", "email extractor"
      ],
      patterns: [
        /\b(scrape|scraper|scraping|extract|harvest)\s+.*?\b(emails?|phone\s*numbers?|leads?|profiles?|data|contacts?)\b/i,
        /\b(bulk|mass)\s+.*?\b(email|emails|mail|dm|message|sender|mailer|whatsapp)\b/i,
        /\b(bypass\s+captcha|bot\s+automation\s+farm)\b/i
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

    // 13. SPAMMY KEYWORD STUFFING (MEDIUM RISK - Gig Disapproval / De-ranking)
    KEYWORD_STUFFING_REDUNDANCY: {
      id: "KEYWORD_STUFFING_REDUNDANCY",
      name: "Keyword Stuffing & Redundant Synonyms",
      severity: "MEDIUM",
      fiverrRule: "Gig Title Editorial & Quality Guidelines",
      description: "Stacking repetitive synonyms (e.g. 'bot expert advisor eas indicator robot') triggers editorial rejection: 'Your title contains repetitive keywords.'",
      safeAlternative: "Choose ONE primary clear term: e.g. 'I will develop a custom MT5 Expert Advisor' instead of stacking 'bot ea expert advisor'.",
      keywords: [], // Handled by pattern & frequency analyzer
      patterns: [
        /\b(bot|robot)\b.*?\b(expert\s*advisor|ea|eas)\b.*?\b(bot|robot|expert\s*advisor|ea|eas)\b/i,
        /\b(mt4\s+mt5|mt5\s+mt4)\b.*?\b(bot|ea|indicator)\b.*?\b(bot|ea|indicator)\b.*?\b(bot|ea|indicator)\b/i
      ]
    }
  },

  // Formatting & Title Syntax Rules
  syntaxRules: {
    prefixRule: {
      pattern: /^i\s+will\b/i,
      message: "Gig title must strictly begin with 'I will'."
    },
    maxLength: 80,
    optimalMinLength: 40,
    optimalMaxLength: 70,
    disallowedCharacters: /[!?;:*^~_`|<>{}()[\]]/g,
    repeatedKeywordLimit: 2
  }
};

// Export for Chrome Extension modules / content scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = FIVERR_POLICY_DATABASE;
}
