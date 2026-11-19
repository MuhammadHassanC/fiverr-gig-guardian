/**
 * Fiverr Gig Guardian — Core Risk Analysis Engine
 * Evaluates gig titles against Fiverr Community Standards and syntax rules.
 */

class RiskAnalysisEngine {
  constructor(database) {
    this.db = database || (typeof FIVERR_POLICY_DATABASE !== "undefined" ? FIVERR_POLICY_DATABASE : null);
    if (!this.db) {
      console.error("[Fiverr Guardian] Policy database not loaded.");
    }
  }

  /**
   * Analyzes a gig title and returns structured risk assessment.
   * @param {string} rawTitle 
   * @returns {Object} Analysis result
   */
  analyze(rawTitle) {
    const title = (rawTitle || "").trim();
    const result = {
      title: title,
      length: title.length,
      verdict: "SAFE", // "SAFE" | "CAUTION" | "HIGH_RISK" | "DANGER"
      score: 0, // 0 (Clean) to 100 (Instant Ban)
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

    // 3. Score Calculation & Verdict Determination
    this._finalizeVerdict(result);

    // 4. Generate Safe Rephrasing Alternative if flagged
    if (result.flags.length > 0) {
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
        message: `Title length (${title.length}) exceeds Fiverr 80-character maximum limit.`,
        severity: "HIGH"
      });
    } else if (title.length < rules.optimalMinLength) {
      result.syntaxIssues.push({
        type: "LENGTH_TOO_SHORT",
        message: `Title is short (${title.length} chars). Optimal length is 40-70 characters.`,
        severity: "LOW"
      });
    }

    // Check disallowed punctuation (Fiverr doesn't allow exclamation marks, underscores, etc.)
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
    const capsWords = words.filter(w => w === w.toUpperCase() && /^[A-Z]+$/.test(w));
    if (capsWords.length >= 2) {
      result.syntaxIssues.push({
        type: "ALL_CAPS_SPAM",
        message: `Multiple ALL-CAPS words detected (${capsWords.join(", ")}). Fiverr flags title spamming.`,
        severity: "MEDIUM"
      });
    }

    // Check repeated keywords (keyword stuffing)
    const wordCounts = {};
    const cleanTokens = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
    cleanTokens.forEach(token => {
      if (token.length > 3 && !["will", "your", "with", "from", "that", "this"].includes(token)) {
        wordCounts[token] = (wordCounts[token] || 0) + 1;
      }
    });

    Object.entries(wordCounts).forEach(([word, count]) => {
      if (count > rules.repeatedKeywordLimit) {
        result.syntaxIssues.push({
          type: "KEYWORD_STUFFING",
          message: `The keyword '${word}' appears ${count} times (Keyword stuffing).`,
          severity: "MEDIUM"
        });
      }
    });
  }

  _checkPolicies(title, result) {
    const lowerTitle = title.toLowerCase();
    const categories = this.db.categories;
    const detectedWordSet = new Set();

    for (const [catKey, cat] of Object.entries(categories)) {
      let matchedInCat = false;

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
              matchedInCat = true;
            }
          }
        }
      }

      // 2. Keyword dictionary search (multi-word first)
      const sortedKeywords = [...cat.keywords].sort((a, b) => b.length - a.length);
      for (const kw of sortedKeywords) {
        // Word boundary check
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

  _finalizeVerdict(result) {
    const hasCritical = result.flags.some(f => f.severity === "CRITICAL");
    const hasHigh = result.flags.some(f => f.severity === "HIGH");
    const hasMedium = result.flags.some(f => f.severity === "MEDIUM");
    const hasSyntaxHigh = result.syntaxIssues.some(s => s.severity === "HIGH");
    const hasSyntaxMedium = result.syntaxIssues.some(s => s.severity === "MEDIUM");

    if (hasCritical) {
      result.verdict = "DANGER";
      result.score = 95;
      result.summaryMessage = "CRITICAL RISK: Prohibited keyword detected. Using this title risks immediate gig removal or account warning strike.";
    } else if (hasHigh || hasSyntaxHigh) {
      result.verdict = "HIGH_RISK";
      result.score = 75;
      result.summaryMessage = "HIGH RISK: Disallowed commercial claim or ToS conflict detected. Automated review will likely reject this gig.";
    } else if (hasMedium || hasSyntaxMedium || result.flags.length > 0) {
      result.verdict = "CAUTION";
      result.score = 40;
      result.summaryMessage = "CAUTION: Title contains risky phrasing or formatting discrepancies. Adjust before publishing.";
    } else {
      result.verdict = "SAFE";
      result.score = 0;
      result.summaryMessage = "COMPLIANT: No prohibited Fiverr keywords detected. Title adheres to Community Standards.";
    }
  }

  _generateAlternative(title, flags) {
    let clean = title;
    
    // Replacement mappings for common trap words
    const replacements = {
      "homework": "coding project",
      "assignment": "technical task",
      "coursework": "learning guidance",
      "thesis": "research documentation",
      "dissertation": "academic paper proofreading",
      "essay": "technical writing",
      "exam": "quiz study guide",
      "hack": "security audit",
      "hacking": "penetration test",
      "crack": "troubleshoot",
      "recover account": "account security setup",
      "whatsapp": "Fiverr chat",
      "telegram": "Fiverr workspace",
      "email": "Fiverr messaging",
      "reviews": "usability testing",
      "fake review": "beta tester feedback",
      "buy followers": "organic social media growth",
      "guaranteed profit": "backtested quantitative strategy",
      "100% win rate": "risk-adjusted trading system",
      "scrape emails": "B2B lead generation",
      "scrape leads": "market research list",
      "canva pro lifetime": "custom Canva templates"
    };

    flags.forEach(flag => {
      const target = flag.matchedWord.toLowerCase();
      for (const [bad, good] of Object.entries(replacements)) {
        if (target.includes(bad)) {
          const reg = new RegExp(`\\b${bad}\\b`, 'gi');
          clean = clean.replace(reg, good);
        }
      }
    });

    // Ensure it begins with "I will"
    if (!/^i\s+will\b/i.test(clean)) {
      clean = "I will " + clean.replace(/^i\s+/i, "");
    }

    // Trim length if needed
    if (clean.length > 80) {
      clean = clean.substring(0, 77) + "...";
    }

    return clean !== title ? clean : null;
  }
}

// Export for Chrome Extension modules / content scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = RiskAnalysisEngine;
}
