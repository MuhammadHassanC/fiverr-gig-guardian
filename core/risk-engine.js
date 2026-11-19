/**
 * Fiverr Gig Guardian — Core Risk Analysis Engine
 * Evaluates gig titles against Fiverr Community Standards and syntax rules.
 * Version 2.0 (Enhanced with Trading/Bot/Prop Firm & Redundancy checks)
 */

class RiskAnalysisEngine {
  constructor(database) {
    this.db = database || (typeof FIVERR_POLICY_DATABASE !== "undefined" ? FIVERR_POLICY_DATABASE : null);
    if (!this.db) {
      console.error("[Fiverr Guardian] Policy database not loaded.");
    }
  }

  analyze(rawTitle) {
    const title = (rawTitle || "").trim();
    const result = {
      title: title,
      length: title.length,
      verdict: "SAFE", // "SAFE" | "CAUTION" | "HIGH_RISK" | "DANGER"
      score: 0, // 0 to 100
      flags: [],
      syntaxIssues: [],
      safeAlternative: null,
      summaryMessage: "Gig title is compliant with Fiverr Community Standards."
    };

    if (!title) {
      result.verdict = "CAUTION";
      result.summaryMessage = "Title is empty.";
      return result;
    }

    // 1. Syntax & Formatting Checks
    this._checkSyntax(title, result);

    // 2. Policy & Keyword Matching
    this._checkPolicies(title, result);

    // 3. Domain Specific Heuristics (Trading / Bot / EA Redundancy)
    this._checkDomainHeuristics(title, result);

    // 4. Score Calculation & Final Verdict
    this._finalizeVerdict(result);

    // 5. Generate Safe Rephrasing Alternative if flagged
    if (result.flags.length > 0 || result.syntaxIssues.length > 0) {
      result.safeAlternative = this._generateAlternative(title, result.flags);
    }

    return result;
  }

  _checkSyntax(title, result) {
    const rules = this.db.syntaxRules;

    // Check "I will" prefix
    if (!rules.prefixRule.pattern.test(title)) {
      result.syntaxIssues.push({
        type: "PREFIX_MISSING",
        message: rules.prefixRule.message,
        severity: "MEDIUM"
      });
    }

    // Check length
    if (title.length > rules.maxLength) {
      result.syntaxIssues.push({
        type: "MAX_LENGTH_EXCEEDED",
        message: `Title length (${title.length}) exceeds Fiverr 80-character limit. Fiverr will reject this gig.`,
        severity: "HIGH"
      });
    } else if (title.length < rules.optimalMinLength) {
      result.syntaxIssues.push({
        type: "LENGTH_TOO_SHORT",
        message: `Title is short (${title.length} chars). Optimal length is 40-70 characters.`,
        severity: "LOW"
      });
    }

    // Check disallowed punctuation
    const invalidChars = title.match(rules.disallowedCharacters);
    if (invalidChars) {
      const uniqueChars = Array.from(new Set(invalidChars)).join(" ");
      result.syntaxIssues.push({
        type: "INVALID_PUNCTUATION",
        message: `Disallowed characters found: [ ${uniqueChars} ]. Fiverr rejects special symbols in titles.`,
        severity: "MEDIUM"
      });
    }

    // Check ALL CAPS spamming
    const words = title.split(/\s+/).filter(w => w.length > 2);
    const capsWords = words.filter(w => w === w.toUpperCase() && /^[A-Z]+$/.test(w) && !["MT4", "MT5", "EA", "MQL4", "MQL5", "API", "UI", "UX", "SEO", "B2B"].includes(w));
    if (capsWords.length >= 2) {
      result.syntaxIssues.push({
        type: "ALL_CAPS_SPAM",
        message: `Multiple ALL-CAPS words detected (${capsWords.join(", ")}). Fiverr flags title spamming.`,
        severity: "MEDIUM"
      });
    }
  }

  _checkPolicies(title, result) {
    const lowerTitle = title.toLowerCase();
    const categories = this.db.categories;
    const detectedWordSet = new Set();

    for (const [catKey, cat] of Object.entries(categories)) {
      // 1. Regex pattern matches
      if (cat.patterns && cat.patterns.length > 0) {
        for (const pattern of cat.patterns) {
          const match = lowerTitle.match(pattern);
          if (match) {
            const matchedText = match[0];
            if (!detectedWordSet.has(matchedText.toLowerCase())) {
              detectedWordSet.add(matchedText.toLowerCase());
              result.flags.push({
                matchedWord: matchedText,
                categoryId: cat.id,
                categoryName: cat.name,
                severity: cat.severity,
                fiverrRule: cat.fiverrRule,
                description: cat.description,
                safeAlternative: cat.safeAlternative
              });
            }
          }
        }
      }

      // 2. Keyword dictionary search
      const sortedKeywords = [...cat.keywords].sort((a, b) => b.length - a.length);
      for (const kw of sortedKeywords) {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const kwRegex = new RegExp(`(^|\\b|\\s)${escaped}(\\b|\\s|$)`, 'i');
        if (kwRegex.test(lowerTitle)) {
          if (!detectedWordSet.has(kw.toLowerCase())) {
            detectedWordSet.add(kw.toLowerCase());
            result.flags.push({
              matchedWord: kw,
              categoryId: cat.id,
              categoryName: cat.name,
              severity: cat.severity,
              fiverrRule: cat.fiverrRule,
              description: cat.description,
              safeAlternative: cat.safeAlternative
            });
          }
        }
      }
    }
  }

  _checkDomainHeuristics(title, result) {
    const lower = title.toLowerCase();

    // Heuristic 1: Repetitive Bot / EA Synonym Stacking (Keyword Stuffing)
    // e.g. "I will develop your mt4 mt5 bot expert advisor eas or indicator"
    const botSynonyms = ["bot", "robot", "expert advisor", "ea", "eas"];
    const matchedSynonyms = botSynonyms.filter(syn => {
      const reg = new RegExp(`\\b${syn}\\b`, 'i');
      return reg.test(lower);
    });

    if (matchedSynonyms.length >= 3) {
      result.flags.push({
        matchedWord: matchedSynonyms.join(" + "),
        categoryId: "KEYWORD_STUFFING_REDUNDANCY",
        categoryName: "Keyword Stuffing & Synonym Redundancy",
        severity: "MEDIUM",
        fiverrRule: "Gig Title Editorial Quality Guidelines",
        description: `Your title stacks redundant synonyms (${matchedSynonyms.join(", ")}). Fiverr moderation frequently rejects this with: 'Your title contains repetitive keywords.'`,
        safeAlternative: "Choose ONE primary term, e.g. 'custom MT5 Expert Advisor' or 'automated trading bot'."
      });
    }

    // Heuristic 2: Dangerous "Modify" / "Clone" with Protected Software
    if (/\b(modify|clone|rip|copy)\b/i.test(lower) && /\b(ea|indicator|expert\s*advisor|script|bot)\b/i.test(lower)) {
      if (!result.flags.some(f => f.categoryId === "DECOMPILATION_IP_THEFT")) {
        result.flags.push({
          matchedWord: "modify / clone EA or indicator",
          categoryId: "DECOMPILATION_IP_THEFT",
          categoryName: "Potential IP Infringement / Decompilation Risk",
          severity: "HIGH",
          fiverrRule: "Intellectual Property & Copyright Policy",
          description: "Phrasing like 'modify existing EA' invites buyers asking to decompile protected .ex4/.ex5 files or remove licensing locks, which triggers instant Fiverr account bans.",
          safeAlternative: "Say 'update and optimize your custom MQL4/MQL5 source code' to make it clear you only work with legitimate source code."
        });
      }
    }
  }

  _finalizeVerdict(result) {
    const hasCritical = result.flags.some(f => f.severity === "CRITICAL");
    const hasHigh = result.flags.some(f => f.severity === "HIGH");
    const hasMedium = result.flags.some(f => f.severity === "MEDIUM");
    const hasSyntaxHigh = result.syntaxIssues.some(s => s.severity === "HIGH");
    const hasSyntaxMedium = result.syntaxIssues.some(s => s.severity === "MEDIUM");

    if (hasCritical) {
      result.verdict = "DANGER";
      result.score = 95;
      result.summaryMessage = "CRITICAL RISK: Prohibited keyword detected. Using this title risks immediate gig removal or permanent account warning strike.";
    } else if (hasHigh || hasSyntaxHigh) {
      result.verdict = "HIGH_RISK";
      result.score = 75;
      result.summaryMessage = "HIGH RISK: Disallowed claim, IP risk, or ToS conflict detected. Automated review will likely reject this gig.";
    } else if (hasMedium || hasSyntaxMedium || result.flags.length > 0) {
      result.verdict = "CAUTION";
      result.score = 45;
      result.summaryMessage = "CAUTION: Title contains risky phrasing, keyword stuffing, or formatting discrepancies. Adjust before publishing.";
    } else {
      result.verdict = "SAFE";
      result.score = 0;
      result.summaryMessage = "COMPLIANT: No prohibited Fiverr keywords detected. Title adheres to Community Standards.";
    }
  }

  _generateAlternative(title, flags) {
    let clean = title;

    const replacements = {
      "pass prop firm": "build prop firm compliant risk EA",
      "prop firm bot": "risk-managed prop firm EA",
      "pass ftmo": "build FTMO compliant trading EA",
      "profitable ea": "backtested quantitative EA",
      "profitable bot": "algorithmic trading system",
      "guaranteed profit": "backtested quantitative strategy",
      "100% win rate": "risk-adjusted trading system",
      "99% win rate": "high-probability strategy",
      "forex signals": "technical market indicator",
      "decompile": "recode trading strategy",
      "homework": "coding project",
      "assignment": "technical task",
      "coursework": "learning guidance",
      "thesis": "research documentation",
      "dissertation": "academic paper proofreading",
      "essay": "technical writing",
      "exam": "quiz study guide",
      "hack": "security audit",
      "hacking": "penetration test",
      "whatsapp": "Fiverr chat",
      "telegram": "Fiverr workspace",
      "email": "Fiverr messaging",
      "reviews": "usability testing",
      "google reviews": "user feedback testing",
      "buy followers": "organic social media growth",
      "scrape emails": "B2B lead generation",
      "scrape leads": "market research list",
      "canva pro lifetime": "custom Canva templates"
    };

    // Clean redundant synonym stuffing
    if (/\bbot\b.*?\bexpert\s*advisor\b.*?\b(ea|eas)\b/i.test(clean)) {
      clean = clean.replace(/\b(bot\s+expert\s*advisor\s+eas|bot\s+expert\s*advisor|expert\s*advisor\s+eas)\b/gi, "Expert Advisor");
    }

    flags.forEach(flag => {
      const target = flag.matchedWord.toLowerCase();
      for (const [bad, good] of Object.entries(replacements)) {
        if (target.includes(bad)) {
          const reg = new RegExp(`\\b${bad}\\b`, 'gi');
          clean = clean.replace(reg, good);
        }
      }
    });

    if (!/^i\s+will\b/i.test(clean)) {
      clean = "I will " + clean.replace(/^i\s+/i, "");
    }

    if (clean.length > 80) {
      clean = clean.substring(0, 77) + "...";
    }

    return clean !== title ? clean : null;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = RiskAnalysisEngine;
}
