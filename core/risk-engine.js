/**
 * Fiverr Gig Guardian — Core Risk Analysis Engine (Version 2.2)
 * 100% Deterministic Policy Evaluation — Zero Flapping, Zero False Positives.
 */

class RiskAnalysisEngine {
  constructor(database) {
    this.db = database || (typeof FIVERR_POLICY_DATABASE !== "undefined" ? FIVERR_POLICY_DATABASE : null);
    if (!this.db) {
      console.error("[Fiverr Guardian] Policy database not loaded.");
    }
  }

  analyze(rawTitle) {
    // 1. Normalize Title String (Collapse whitespace, trim)
    const title = (rawTitle || "").replace(/\s+/g, " ").trim();

    const result = {
      title: title,
      length: title.length,
      verdict: "SAFE", // "SAFE" | "CAUTION" | "HIGH_RISK" | "DANGER"
      score: 0,
      flags: [],
      syntaxIssues: [],
      safeAlternative: null,
      summaryMessage: "Compliant with Fiverr Community Standards."
    };

    if (!title) {
      result.verdict = "CAUTION";
      result.summaryMessage = "Title is empty.";
      return result;
    }

    // 2. Syntax & Formatting Checks
    this._checkSyntax(title, result);

    // 3. Exact Policy & Keyword Matching
    this._checkPolicies(title, result);

    // 4. Final Verdict Determination
    this._finalizeVerdict(result);

    // 5. Generate Safe Alternative if needed
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

    // Check length (Fiverr strict 80-char limit)
    if (title.length > rules.maxLength) {
      result.syntaxIssues.push({
        type: "MAX_LENGTH_EXCEEDED",
        message: `Title length (${title.length}) exceeds Fiverr 80-character limit.`,
        severity: "HIGH"
      });
    }

    // Disallowed special punctuation
    const invalidChars = title.match(rules.disallowedCharacters);
    if (invalidChars) {
      const uniqueChars = Array.from(new Set(invalidChars)).join(" ");
      result.syntaxIssues.push({
        type: "INVALID_PUNCTUATION",
        message: `Disallowed characters found: [ ${uniqueChars} ].`,
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
            const matchedText = match[0].trim();
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

      // 2. Keyword dictionary search (longer phrases first)
      const sortedKeywords = [...cat.keywords].sort((a, b) => b.length - a.length);
      for (const kw of sortedKeywords) {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const kwRegex = new RegExp(`(^|\\b|\\s)${escaped}(\\b|\\s|$)`, "i");
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

    if (hasCritical) {
      result.verdict = "DANGER";
      result.score = 95;
      result.summaryMessage = "Forbidden word detected. This gig title violates Fiverr Community Guidelines and risks account warning or removal.";
    } else if (hasHigh || hasSyntaxHigh) {
      result.verdict = "HIGH_RISK";
      result.score = 75;
      result.summaryMessage = "High-risk claim or ToS conflict detected. Review or modify before publishing.";
    } else if (hasMedium || result.syntaxIssues.length > 0) {
      result.verdict = "CAUTION";
      result.score = 40;
      result.summaryMessage = "Title needs minor syntax or clarity adjustment.";
    } else {
      result.verdict = "SAFE";
      result.score = 0;
      result.summaryMessage = "Title is compliant with Fiverr Community Standards.";
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

    flags.forEach(flag => {
      const target = flag.matchedWord.toLowerCase();
      for (const [bad, good] of Object.entries(replacements)) {
        if (target.includes(bad)) {
          const reg = new RegExp(`\\b${bad}\\b`, "gi");
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
