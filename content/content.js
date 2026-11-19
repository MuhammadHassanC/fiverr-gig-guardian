/**
 * Fiverr Gig Guardian — Content Script (Version 2.0)
 * Universal DOM Scanner for Fiverr search results, category grids, profiles,
 * and gig creation editor. Detects all prohibited terms and trading/EA pitfalls.
 */

(function () {
  "use strict";

  if (window.__fggInjected_v2) return;
  window.__fggInjected_v2 = true;

  console.log("[Fiverr Gig Guardian v2.0] Initialized on:", window.location.href);

  // Initialize Risk Engine
  const engine = new RiskAnalysisEngine(FIVERR_POLICY_DATABASE);

  // Active Tooltip Reference
  let activeFloatingTooltip = null;

  // ============================================================================
  // 1. UNIVERSAL GIG TITLE & CARD SCANNER
  // ============================================================================
  function scanGigCardsUniversal() {
    // Strategy 1: Find all elements whose text starts with "I will"
    const allElements = document.querySelectorAll("p, h3, a, span, div");
    const titleCandidates = [];

    allElements.forEach(el => {
      // Must not be our own injected element
      if (el.closest(".fgg-badge-container") || el.closest(".fgg-editor-panel") || el.closest(".fgg-tooltip-card")) {
        return;
      }

      // Check text starts with "I will " (case-insensitive)
      const text = (el.textContent || "").trim();
      if (/^i\s+will\b/i.test(text) && text.length >= 15 && text.length <= 150) {
        // Ensure this is the most specific/innermost element with this text
        const hasChildWithSameText = Array.from(el.children).some(child => {
          return /^i\s+will\b/i.test((child.textContent || "").trim());
        });
        if (!hasChildWithSameText) {
          titleCandidates.push({ element: el, title: text });
        }
      }
    });

    titleCandidates.forEach(({ element, title }) => {
      // Find the card container
      const card = element.closest(
        "[data-testid*='gig-card'], [data-gig-id], .gig-card-layout, .basic-gig-card, .gig-wrapper, article, div[class*='gig-card'], div[class*='gigCard'], div[class*='card-wrapper']"
      ) || element.closest("div.relative, div[tabindex='-1'], li");

      if (!card) return;
      if (card.dataset.fggScanned === "true") return;
      card.dataset.fggScanned = "true";

      // Run Risk Engine
      const analysis = engine.analyze(title);

      // Attach Badges (Overlay on thumbnail + Inline above title)
      injectBadgesToCard(card, element, analysis);
    });
  }

  function injectBadgesToCard(card, titleElem, analysis) {
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
      badgeLabel = "Notice";
    }

    // 1. INLINE BADGE (Above or directly before title)
    const inlineContainer = document.createElement("div");
    inlineContainer.className = `fgg-badge-container fgg-inline-container`;
    
    const inlineBadge = document.createElement("div");
    inlineBadge.className = `fgg-badge ${badgeClass}`;
    inlineBadge.innerHTML = `<span class="fgg-badge-indicator"></span> ${badgeLabel}`;
    inlineContainer.appendChild(inlineBadge);

    // Attach hover listeners for floating tooltip
    attachTooltipEvents(inlineBadge, analysis);

    // Insert inline badge safely before titleElem without disrupting line-clamp
    if (titleElem.parentNode) {
      titleElem.parentNode.insertBefore(inlineContainer, titleElem);
    }

    // 2. OVERLAY BADGE ON THUMBNAIL (Never clipped by overflow or clamping)
    const mediaContainer = card.querySelector(
      ".media-container, .gig-card-media, [data-testid*='media'], div:has(> img), div[class*='image'], div[class*='media']"
    ) || card.querySelector("img")?.parentNode;

    if (mediaContainer && !mediaContainer.querySelector(".fgg-overlay-badge")) {
      // Ensure mediaContainer has relative positioning
      const computedPos = window.getComputedStyle(mediaContainer).position;
      if (computedPos === "static") {
        mediaContainer.style.position = "relative";
      }

      const overlayBadge = document.createElement("div");
      overlayBadge.className = `fgg-badge fgg-overlay-badge ${badgeClass}`;
      overlayBadge.innerHTML = `<span class="fgg-badge-indicator"></span> ${badgeLabel}`;
      
      attachTooltipEvents(overlayBadge, analysis);
      mediaContainer.appendChild(overlayBadge);
    }
  }

  // ============================================================================
  // 2. FLOATING FIXED TOOLTIP (Zero Clipping Guaranteed)
  // ============================================================================
  function attachTooltipEvents(badgeElem, analysis) {
    badgeElem.addEventListener("mouseenter", (e) => {
      showFloatingTooltip(badgeElem, analysis);
    });

    badgeElem.addEventListener("mouseleave", () => {
      hideFloatingTooltip();
    });
  }

  function showFloatingTooltip(anchorElem, analysis) {
    hideFloatingTooltip();

    const tooltip = document.createElement("div");
    tooltip.className = "fgg-floating-tooltip";

    let headerClass = analysis.verdict.toLowerCase().replace("_", "-");
    let tooltipHtml = `
      <div class="fgg-tooltip-header">
        <span class="fgg-tooltip-title ${headerClass}">Risk Score: ${analysis.score}/100 • ${analysis.verdict.replace('_', ' ')}</span>
      </div>
      <div class="fgg-tooltip-body">
    `;

    if (analysis.flags.length > 0) {
      tooltipHtml += `
        <div style="font-size:11px; font-weight:700; color:#cbd5e1; margin-bottom:4px;">Flagged Compliance Triggers:</div>
        <div class="fgg-flags-list">
          ${analysis.flags.map(f => `<span class="fgg-flag-chip">${escapeHtml(f.matchedWord)}</span>`).join("")}
        </div>
        <div class="fgg-policy-rule">
          <strong>Violated Rule:</strong> ${escapeHtml(analysis.flags[0].fiverrRule)}<br>
          <span style="font-size:10px; color:#cbd5e1; display:block; margin-top:2px;">${escapeHtml(analysis.flags[0].description)}</span>
        </div>
        <div class="fgg-legacy-notice">
          <strong>Seller Warning:</strong> This gig may be grandfathered from older approval. <strong>Do NOT copy this title</strong>; creating a new gig with these terms will trigger Fiverr's automated compliance filters to deny the gig or issue an account warning strike.
        </div>
      `;

      if (analysis.safeAlternative) {
        tooltipHtml += `
          <div class="fgg-alt-box">
            <span class="fgg-alt-title">Compliant Safe Rephrasing:</span>
            <span style="font-family:monospace; font-size:11px;">"${escapeHtml(analysis.safeAlternative)}"</span>
            <button type="button" class="fgg-copy-btn" id="fgg-floating-copy-btn" data-copy="${escapeHtml(analysis.safeAlternative)}">Copy Safe Title</button>
          </div>
        `;
      }
    } else {
      tooltipHtml += `
        <div style="color:#34d399; font-size:12px; font-weight:600; margin-bottom:4px;">Compliant & Safe</div>
        <div style="font-size:11px; color:#94a3b8;">This gig title adheres to Fiverr Community Guidelines and is safe for reference.</div>
      `;
    }

    tooltipHtml += `</div>`;
    tooltip.innerHTML = tooltipHtml;
    document.body.appendChild(tooltip);
    activeFloatingTooltip = tooltip;

    // Position floating tooltip near anchor element
    const rect = anchorElem.getBoundingClientRect();
    const tooltipWidth = 330;
    let left = rect.left;
    let top = rect.bottom + 6;

    // Check right edge
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }
    if (left < 10) left = 10;

    // Check bottom edge
    if (top + 200 > window.innerHeight) {
      top = rect.top - tooltip.offsetHeight - 6;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    // Copy button listener
    const copyBtn = tooltip.querySelector("#fgg-floating-copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const text = copyBtn.getAttribute("data-copy");
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => { copyBtn.textContent = "Copy Safe Title"; }, 1500);
        });
      });
    }

    // Keep tooltip visible if user moves mouse into tooltip
    tooltip.addEventListener("mouseenter", () => {
      if (tooltip._leaveTimeout) clearTimeout(tooltip._leaveTimeout);
    });
    tooltip.addEventListener("mouseleave", () => {
      hideFloatingTooltip();
    });
  }

  function hideFloatingTooltip() {
    if (activeFloatingTooltip) {
      activeFloatingTooltip.remove();
      activeFloatingTooltip = null;
    }
  }

  // ============================================================================
  // 3. GIG CREATOR & EDITOR LIVE MONITOR
  // ============================================================================
  function scanGigEditor() {
    const isEditor = window.location.href.includes("manage_gigs") ||
                     window.location.href.includes("/new") ||
                     window.location.href.includes("/edit") ||
                     document.querySelector("textarea[name*='title']") !== null;

    if (!isEditor) return;

    const titleInput = document.querySelector(
      "textarea[name*='title'], input[name*='title'], [data-testid*='title'], .gig-title-text, .gig-title-input"
    );
    if (!titleInput || titleInput.dataset.fggEditorAttached === "true") return;

    titleInput.dataset.fggEditorAttached = "true";
    console.log("[Fiverr Gig Guardian] Attached live title monitor to Gig Editor.");

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

    const parentContainer = titleInput.closest(".form-row, .gig-title-wrapper, .field-wrapper") || titleInput.parentNode;
    parentContainer.parentNode.insertBefore(panel, parentContainer.nextSibling);

    const statusElem = panel.querySelector("#fgg-editor-status");
    const countElem = panel.querySelector("#fgg-char-count");

    const updateEditorStatus = () => {
      const currentVal = titleInput.value || "";
      const len = currentVal.length;

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
        bannerTitle = "HIGH RISK: Disallowed Claim, IP Risk, or ToS Conflict";
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

    titleInput.addEventListener("input", updateEditorStatus);
    titleInput.addEventListener("keyup", updateEditorStatus);
    titleInput.addEventListener("change", updateEditorStatus);

    updateEditorStatus();
  }

  // ============================================================================
  // 4. DEBOUNCED SPA OBSERVER
  // ============================================================================
  let debounceTimer = null;
  const observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      scanGigCardsUniversal();
      scanGigEditor();
    }, 150);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial immediate execution
  scanGigCardsUniversal();
  scanGigEditor();

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
