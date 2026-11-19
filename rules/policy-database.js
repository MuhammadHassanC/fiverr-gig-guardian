/**
 * Fiverr Policy & Community Guidelines Database
 * High-precision regulatory rule set mapping prohibited keywords, regex patterns,
 * severity weights, and official Fiverr Community Standards references.
 */

const FIVERR_POLICY_DATABASE = {
  version: "2026.11",
  lastUpdated: "2026-11-19",
  categories: {
    ACADEMIC_DISHONESTY: {
      id: "ACADEMIC_DISHONESTY",
      name: "Academic Dishonesty & School Work",
      severity: "CRITICAL", // Instant gig rejection / warning strike
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

    GUARANTEED_FINANCIAL_CLAIMS: {
      id: "GUARANTEED_FINANCIAL_CLAIMS",
      name: "Guaranteed Profits & Get-Rich-Quick",
      severity: "HIGH",
      fiverrRule: "Misleading Services & Financial Disclaimers Policy",
      description: "Promising guaranteed financial returns, ROI, trading win-rates, or instant profits triggers immediate regulatory takedowns.",
      safeAlternative: "Describe the quantitative model, backtested parameters, or risk management strategy without promising returns.",
      keywords: [
        "guaranteed profit", "100% win rate", "get rich", "guaranteed sales",
        "make money fast", "guaranteed roi", "passive income guarantee",
        "crypto pump", "insider signals", "forex guarantee", "guaranteed return",
        "double your money", "make $1000 daily", "automated income",
        "guaranteed earnings", "risk free profit", "guaranteed income",
        "guarantee 100%", "guaranteed winning"
      ],
      patterns: [
        /\b(guaranteed|risk[- ]free|100%)\s+.*?\b(profit|profits|roi|return|income|sales|win\s*rate|winning)\b/i,
        /\b(get\s+rich|make\s+money\s+fast|double\s+your\s+money)\b/i,
        /\b(crypto\s+pump|insider\s+trading\s+signals)\b/i
      ]
    },

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
        "sell iptv", "iptv subscription", "cracked plugin", "gpl cracked",
        "lifetime license", "cheap windows key"
      ],
      patterns: [
        /\b(canva\s*pro|netflix|spotify|office\s*365|windows\s*1[01])\s+.*?\b(lifetime|account|cheap|crack|key|license)\b/i,
        /\b(nulled|cracked|warez)\s+(script|theme|plugin|code|bot)\b/i,
        /\b(iptv\s+.*?(stream|subscription|service|channels))\b/i
      ]
    },

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
        "novelty document", "edit bank statement", "edit paystub",
        "counterfeit document", "edit pdf statement"
      ],
      patterns: [
        /\b(fake|counterfeit|novelty)\s+(id|passport|diploma|certificate|license|document)\b/i,
        /\b(edit|modify)\s+.*?\b(bank\s+statement|paystub|utility\s+bill|invoice|receipt|document)\b/i
      ]
    },

    MEDICAL_LEGAL_ADVICE: {
      id: "MEDICAL_LEGAL_ADVICE",
      name: "Uncertified Medical or Legal Claims",
      severity: "HIGH",
      fiverrRule: "Regulated Professional Advice & Healthcare Policy",
      description: "Offering clinical diagnoses, prescription cures, or unaccredited legal representation is forbidden for user safety.",
      safeAlternative: "Focus on general fitness routines, diet templates, or legal document proofreading.",
      keywords: [
        "cure cancer", "medical prescription", "doctor consultation",
        "cure disease", "weight loss cure", "cure diabetes", "diagnose illness",
        "prescription drug", "legal representation in court"
      ],
      patterns: [
        /\b(cure|prescribe|treat)\s+.*?\b(cancer|diabetes|illness|disease|infection)\b/i,
        /\b(medical\s+prescription|legal\s+representation)\b/i
      ]
    },

    IMPERSONATING_FIVERR_BADGES: {
      id: "IMPERSONATING_FIVERR_BADGES",
      name: "Impersonating Fiverr Badges",
      severity: "HIGH",
      fiverrRule: "Fiverr Trademark & Badge Misrepresentation",
      description: "Using Fiverr internal branding like 'Fiverr Choice' or 'Top Rated Seller' in your title triggers manual review.",
      safeAlternative: "Use authentic quality descriptions like 'Professional', 'Senior Developer', or 'High Quality'.",
      keywords: [
        "fiverr choice", "fiverr's choice", "top rated seller guaranteed",
        "official fiverr", "fiverr pro guaranteed", "fiverr staff"
      ],
      patterns: [
        /\b(fiverr('s)?\s+(choice|pro|official|staff|guaranteed))\b/i,
        /\b(top\s*rated\s*seller\s*guaranteed)\b/i
      ]
    },

    UNREALISTIC_GUARANTEES: {
      id: "UNREALISTIC_GUARANTEES",
      name: "Spammy / Unrealistic Promises",
      severity: "MEDIUM",
      fiverrRule: "Editorial Guidelines & Commercial Disclaimers",
      description: "Making claims of #1 rank in 24 hours or 100% money back in titles often leads to buyer dispute penalties.",
      safeAlternative: "Describe proven methods: 'White-Hat SEO Optimization', 'Conversion Focused'.",
      keywords: [
        "100% satisfaction or money back", "rank #1 in 24 hours",
        "guaranteed google first page", "viral in 1 hour", "instant ranking",
        "100% money back guarantee"
      ],
      patterns: [
        /\b(rank\s+#?1\s+in\s+24\s*(hours|hrs)|viral\s+in\s+(1|one)\s*hour)\b/i,
        /\b(100%\s+money\s*back\s*guarantee)\b/i,
        /\b(guaranteed\s+(first|1st)\s+page)\b/i
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
