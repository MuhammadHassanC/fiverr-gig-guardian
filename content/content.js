/**
 * Fiverr Gig Guardian — Content Script
 * Monitors Fiverr search pages, category listings, and gig creation editors.
 * Evaluates gig titles in real-time against Fiverr Community Standards.
 */

(function () {
  "use strict";

  // Prevent double injection
  if (window.__fggInjected) return;
  window.__fggInjected = true;

  console.log("[Fiverr Gig Guardian] Active on page:", window.location.href);

  // Initialize Risk Engine
  const engine = new RiskAnalysisEngine(FIVERR_POLICY_DATABASE);

  // ============================================================================
  // 1. GIG CARDS SCANNER (Search / Category / Profile Pages)
  // ============================================================================
  const GIG_CARD_SELECTORS = [
    ".gig-card-layout",
    "[data-gig-id]",
    ".gig-wrapper",
    ".basic-gig-card",
    "article[class*='gig-card']",
    ".gig-card"
  ];

  const TITLE_SELECTORS = [
    "a[title]",
    "h3 a",
    "[data-testid='gig-card-title']",
    ".gig-card-layout h3",
    "p[title]",
    "a[href*='/'] h3"
  ];

  function scanGigCards() {
    let cards = [];
    for (const selector of GIG_CARD_SELECTORS) {
      const found = document.querySelectorAll(selector);
      if (found.length > 0) {
        cards = Array.from(found);
        break;
      }
    }

    // Fallback: search for anchor links containing gig URLs
    if (cards.length === 0) {
      const links = document.querySelectorAll("a[href*='/']");
      cards = Array.from(links).filter(a => {
        const h3 = a.querySelector("h3");
        return h3 && h3.textContent.trim().length > 15;
      });
    }

    cards.forEach(card => {
      if (card.dataset.fggScanned === "true") return;

      // Find Title
      let titleElem = null;
      for (const tSel of TITLE_SELECTORS) {
        titleElem = card.querySelector(tSel);
        if (titleElem && titleElem.textContent.trim().length > 5) break;
      }

      // If card itself is the link with title attribute
      if (!titleElem && card.getAttribute("title")) {
        titleElem = card;
      }

      if (!titleElem) return;

      const rawTitle = titleElem.getAttribute("title") || titleElem.textContent || "";
      const cleanTitle = rawTitle.trim();
      if (!cleanTitle || cleanTitle.length < 5) return;

      // Run Risk Engine
      const analysis = engine.analyze(cleanTitle);

      // Mark scanned
      card.dataset.fggScanned = "true";

      // Inject Badge
      injectCardBadge(card, titleElem, analysis);
    });
  }

  function injectCardBadge(card, titleElem, analysis) {
    const container = document.createElement("div");
    container.className = "fgg-badge-container";

    const badge = document.createElement("div");
    let badgeClass = "fgg-badge-safe";
    let badgeLabel = "Compliant";

    if (analysis.verdict === "DANGER") {
      badgeClass = "fgg-badge-danger";
      badgeLabel = "Policy Hazard";
    } else if (analysis.verdict === "HIGH_RISK") {
      badgeClass = "fgg-badge-high-risk";
      badgeLabel = "High Risk";
    } else if (analysis.verdict === "CAUTION") {
      badgeClass = "fgg-badge-caution";
      badgeLabel = "Caution";
    }

    badge.className = `fgg-badge ${badgeClass}`;
    badge.innerHTML = `<span class="fgg-badge-indicator"></span> ${badgeLabel}`;
    container.appendChild(badge);

    // Build Tooltip Card
    const tooltip = document.createElement("div");
    tooltip.className = "fgg-tooltip-card";

    let headerClass = analysis.verdict.toLowerCase().replace("_", "-");
    let tooltipHtml = `
      <div class="fgg-tooltip-header">
        <span class="fgg-tooltip-title ${headerClass}">Risk Score: ${analysis.score}/100 • ${analysis.verdict}</span>
      </div>
      <div class="fgg-tooltip-body">
    `;

    if (analysis.flags.length > 0) {
      tooltipHtml += `
        <div style="font-size:11px; font-weight:600; color:#cbd5e1; margin-bottom:4px;">Flagged Forbidden Keywords:</div>
        <div class="fgg-flags-list">
          ${analysis.flags.map(f => `<span class="fgg-flag-chip">${escapeHtml(f.matchedWord)}</span>`).join("")}
        </div>
        <div class="fgg-policy-rule">
          <strong>Rule Violated:</strong> ${escapeHtml(analysis.flags[0].fiverrRule)}<br>
          <span style="font-size:10px; color:#94a3b8;">${escapeHtml(analysis.flags[0].description)}</span>
        </div>
        <div class="fgg-legacy-notice">
          <strong>Notice:</strong> This gig may be older and hasn't been flagged yet. <strong>Do NOT copy this title</strong> for a new gig; current Fiverr automated filters will reject your gig or flag your account.
        </div>
      `;

      if (analysis.safeAlternative) {
        tooltipHtml += `
          <div class="fgg-alt-box">
            <span class="fgg-alt-title">Safe Rephrasing Suggestion:</span>
            <span>"${escapeHtml(analysis.safeAlternative)}"</span>
            <button class="fgg-copy-btn" data-copy="${escapeHtml(analysis.safeAlternative)}">Copy Safe Title</button>
          </div>
        `;
      }
    } else {
      tooltipHtml += `
        <div style="color:#34d399; font-size:12px; margin-bottom:4px;">No prohibited keywords detected.</div>
        <div style="font-size:11px; color:#94a3b8;">This title follows Fiverr Community Guidelines and is safe for reference.</div>
      `;
    }

    tooltipHtml += `</div>`;
    tooltip.innerHTML = tooltipHtml;

    // Handle copy safe button click
    const copyBtn = tooltip.querySelector(".fgg-copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const textToCopy = copyBtn.getAttribute("data-copy");
        navigator.clipboard.writeText(textToCopy).then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => { copyBtn.textContent = "Copy Safe Title"; }, 1500);
        });
      });
    }

    container.appendChild(tooltip);

    // Insert next to or below titleElem
    if (titleElem.parentNode) {
      titleElem.parentNode.insertBefore(container, titleElem.nextSibling);
    } else {
      card.appendChild(container);
    }
  }

  // ============================================================================
  // 2. GIG CREATOR & EDITOR LIVE MONITOR
  // ============================================================================
  function scanGigEditor() {
    const isEditorPage = window.location.href.includes("manage_gigs") ||
                         window.location.href.includes("/new") ||
                         window.location.href.includes("/edit") ||
                         document.querySelector("textarea[name*='title']") !== null;

    if (!isEditorPage) return;

    const titleInput = document.querySelector("textarea[name*='title'], input[name*='title'], [data-testid*='title'], .gig-title-text, .gig-title-input");
    if (!titleInput || titleInput.dataset.fggEditorAttached === "true") return;

    titleInput.dataset.fggEditorAttached = "true";
    console.log("[Fiverr Gig Guardian] Attached live title monitor to Gig Editor.");

    // Create live editor panel
    const panel = document.createElement("div");
    panel.className = "fgg-editor-panel";
    panel.innerHTML = `
      <div class="fgg-editor-header">
        <div class="fgg-editor-brand">
          Fiverr Policy Guardian <span class="fgg-editor-brand-tag">Real-Time</span>
        </div>
        <div class="fgg-char-counter" id="fgg-char-count">0 / 80 chars</div>
      </div>
      <div id="fgg-editor-status"></div>
    `;

    // Insert right after titleInput's container
    const parentContainer = titleInput.closest(".form-row, .gig-title-wrapper, .field-wrapper") || titleInput.parentNode;
    parentContainer.parentNode.insertBefore(panel, parentContainer.nextSibling);

    const statusElem = panel.querySelector("#fgg-editor-status");
    const countElem = panel.querySelector("#fgg-char-count");

    // Real-time update handler
    const updateEditorStatus = () => {
      const currentVal = titleInput.value || "";
      const len = currentVal.length;

      // Update char count badge
      countElem.textContent = `${len} / 80 chars`;
      if (len > 80) {
        countElem.className = "fgg-char-counter exceeded";
      } else if (len >= 40 && len <= 70) {
        countElem.className = "fgg-char-counter optimal";
      } else {
        countElem.className = "fgg-char-counter warning";
      }

      if (len === 0) {
        statusElem.innerHTML = `
          <div class="fgg-alert-banner safe">
            <span class="fgg-alert-title">Ready for Title Inspection</span>
            <span>Type your gig title starting with "I will". We will verify every word against Fiverr's automated bot filters.</span>
          </div>
        `;
        return;
      }

      const res = engine.analyze(currentVal);

      let bannerClass = "safe";
      let bannerTitle = "Compliant & Safe";
      if (res.verdict === "DANGER") {
        bannerClass = "danger";
        bannerTitle = "CRITICAL: Account & Gig Policy Hazard Detected";
      } else if (res.verdict === "HIGH_RISK") {
        bannerClass = "high-risk";
        bannerTitle = "HIGH RISK: Disallowed Claim or ToS Conflict";
      } else if (res.verdict === "CAUTION") {
        bannerClass = "caution";
        bannerTitle = "Notice: Title Review Advised";
      }

      let contentHtml = `
        <div class="fgg-alert-banner ${bannerClass}">
          <div class="fgg-alert-title">${bannerTitle}</div>
          <div>${escapeHtml(res.summaryMessage)}</div>
      `;

      if (res.flags.length > 0) {
        contentHtml += `
          <div class="fgg-detected-words-row">
            <span class="fgg-detected-label">Prohibited Triggers:</span>
            ${res.flags.map(f => `<span class="fgg-flag-chip">${escapeHtml(f.matchedWord)}</span>`).join("")}
          </div>
          <div style="font-size:11px; margin-top:4px;">
            <strong>Rule:</strong> ${escapeHtml(res.flags[0].fiverrRule)} — ${escapeHtml(res.flags[0].description)}
          </div>
        `;

        if (res.safeAlternative) {
          contentHtml += `
            <div class="fgg-suggestion-row">
              <span class="fgg-suggestion-text">${escapeHtml(res.safeAlternative)}</span>
              <button type="button" class="fgg-apply-btn" id="fgg-apply-suggestion">Apply Safe Title</button>
            </div>
          `;
        }
      }

      contentHtml += `</div>`;
      statusElem.innerHTML = contentHtml;

      // Handle apply suggestion click
      const applyBtn = statusElem.querySelector("#fgg-apply-suggestion");
      if (applyBtn && res.safeAlternative) {
        applyBtn.addEventListener("click", () => {
          titleInput.value = res.safeAlternative;
          titleInput.dispatchEvent(new Event("input", { bubbles: true }));
          titleInput.dispatchEvent(new Event("change", { bubbles: true }));
          updateEditorStatus();
        });
      }
    };

    // Attach listeners
    titleInput.addEventListener("input", updateEditorStatus);
    titleInput.addEventListener("keyup", updateEditorStatus);
    titleInput.addEventListener("change", updateEditorStatus);

    // Initial check
    updateEditorStatus();
  }

  // ============================================================================
  // 3. MUTATION OBSERVER & SPA RESILIENCE
  // ============================================================================
  let debounceTimer = null;
  const observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      scanGigCards();
      scanGigEditor();
    }, 150);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial runs
  scanGigCards();
  scanGigEditor();

  // Helper utility
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
