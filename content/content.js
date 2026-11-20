/**
 * Fiverr Gig Guardian — Content Script (Version 2.2)
 * Full Canonical Title Inspection • Consistent Deterministic Tags • Zero Visual Clutter.
 * Simple inline tag at the end of the title text. No image overlays. No buzzwords.
 */

(function () {
  "use strict";

  if (window.__fggInjected_v22) return;
  window.__fggInjected_v22 = true;

  console.log("[Fiverr Gig Guardian v2.2] Initialized.");

  // Initialize Risk Engine
  const engine = new RiskAnalysisEngine(FIVERR_POLICY_DATABASE);

  let activeFloatingTooltip = null;

  // Cleanup old badges or overlay elements from prior versions
  function cleanupOldBadges() {
    document.querySelectorAll(".fgg-overlay-badge, .fgg-badge-container, .fgg-title-badge-wrapper, .fgg-card-badge").forEach(el => el.remove());
  }

  // ============================================================================
  // 1. CANONICAL TITLE EXTRACTION & INLINE TAGGING
  // ============================================================================

  function normalizeTitleText(text) {
    if (!text) return "";
    return text
      .replace(/\b(safe|caution|risk|danger|notice|compliant|policy\s*hazard|high\s*risk)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Extracts the full, un-truncated canonical gig title.
   * Fiverr search results often truncate text inside <p> with line-clamp,
   * but the full title is preserved in a[title], card img[alt], or heading attributes.
   */
  function extractCanonicalTitle(leafElem) {
    // 1. Check enclosing or adjacent anchor's title attribute
    const anchor = leafElem.closest("a[title]") || leafElem.querySelector("a[title]");
    if (anchor) {
      const aTitle = anchor.getAttribute("title") || "";
      if (/^i\s+will\b/i.test(aTitle.trim())) {
        return normalizeTitleText(aTitle);
      }
    }

    // 2. Check if the element itself or parent has a title attribute starting with "I will"
    const titledElem = leafElem.closest("[title^='i will' i], [title^='I will' i]") ||
                       leafElem.querySelector("[title^='i will' i], [title^='I will' i]");
    if (titledElem) {
      const t = titledElem.getAttribute("title") || "";
      if (/^i\s+will\b/i.test(t.trim())) {
        return normalizeTitleText(t);
      }
    }

    // 3. Check card thumbnail image alt attribute
    const card = leafElem.closest("[data-testid='gig-card'], .gig-card-layout, article, div[class*='gig-card']");
    if (card) {
      const img = card.querySelector("img[alt^='i will' i], img[alt^='I will' i]");
      if (img) {
        const alt = img.getAttribute("alt") || "";
        if (/^i\s+will\b/i.test(alt.trim())) {
          return normalizeTitleText(alt);
        }
      }
    }

    // 4. Fallback to clean visible text
    return normalizeTitleText(leafElem.textContent || "");
  }

  function scanGigTitles() {
    cleanupOldBadges();

    // Query candidate elements that hold gig titles
    const candidates = document.querySelectorAll("p, h3, [role='heading'], a");

    candidates.forEach(el => {
      // Skip our own injected elements, editor panels, or tooltips
      if (
        el.classList.contains("fgg-inline-tag") ||
        el.closest(".fgg-editor-panel") ||
        el.closest(".fgg-floating-tooltip")
      ) {
        return;
      }

      const text = (el.textContent || "").trim();
      const hasPrefix = /^i\s+will\b/i.test(text);
      const isAnchorWithTitle = el.tagName === "A" && /^i\s+will\b/i.test((el.getAttribute("title") || "").trim());

      if ((hasPrefix && text.length >= 15 && text.length <= 180) || isAnchorWithTitle) {
        // Find deepest child that actually displays the title text
        const hasChildTitle = Array.from(el.children).some(child => {
          if (child.classList.contains("fgg-inline-tag")) return false;
          return /^i\s+will\b/i.test((child.textContent || "").trim());
        });

        if (hasChildTitle) {
          // Let the child element handle the tag placement
          return;
        }

        // Extract canonical full title
        const fullTitle = extractCanonicalTitle(el);
        if (!fullTitle || fullTitle.length < 15) return;

        // Check if already tagged with this exact canonical title
        if (el.dataset.fggAnalyzedTitle === fullTitle && el.querySelector(".fgg-inline-tag")) {
          return;
        }

        // Run analysis on the 100% full canonical title
        const analysis = engine.analyze(fullTitle);

        // Attach tag right at the end of the title text
        attachTagToEndOfTitle(el, fullTitle, analysis);
      }
    });
  }

  function attachTagToEndOfTitle(titleElem, fullTitle, analysis) {
    titleElem.dataset.fggAnalyzedTitle = fullTitle;
    titleElem.dataset.fggProcessed = "true";

    // Remove any existing tag inside this element to prevent duplicates
    const existing = titleElem.querySelectorAll(".fgg-inline-tag");
    existing.forEach(t => t.remove());

    // Simple labels without buzzwords
    let tagClass = "fgg-tag-safe";
    let tagLabel = "Safe";

    if (analysis.verdict === "DANGER") {
      tagClass = "fgg-tag-danger";
      tagLabel = "Danger";
    } else if (analysis.verdict === "HIGH_RISK") {
      tagClass = "fgg-tag-risk";
      tagLabel = "Risk";
    } else if (analysis.verdict === "CAUTION") {
      tagClass = "fgg-tag-caution";
      tagLabel = "Caution";
    }

    const tag = document.createElement("span");
    tag.className = `fgg-inline-tag ${tagClass}`;
    tag.textContent = tagLabel;
    tag.dataset.verdict = analysis.verdict;

    // Prevent clicking the tag from opening the gig link
    tag.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    // Tooltip listeners
    attachTooltipEvents(tag, analysis);

    // Place tag strictly right at the end of the title text
    titleElem.appendChild(document.createTextNode(" "));
    titleElem.appendChild(tag);
  }

  // ============================================================================
  // 2. MINIMAL FLOATING TOOLTIP
  // ============================================================================
  function attachTooltipEvents(badgeElem, analysis) {
    badgeElem.addEventListener("mouseenter", (e) => {
      e.stopPropagation();
      showFloatingTooltip(badgeElem, analysis);
    });

    badgeElem.addEventListener("mouseleave", (e) => {
      e.stopPropagation();
      hideFloatingTooltip();
    });
  }

  function showFloatingTooltip(anchorElem, analysis) {
    hideFloatingTooltip();

    const tooltip = document.createElement("div");
    tooltip.className = "fgg-floating-tooltip";

    let verdictLabel = "Safe";
    if (analysis.verdict === "DANGER") verdictLabel = "Danger (Do Not Use)";
    else if (analysis.verdict === "HIGH_RISK") verdictLabel = "High Risk";
    else if (analysis.verdict === "CAUTION") verdictLabel = "Caution";

    let headerClass = analysis.verdict.toLowerCase().replace("_", "-");

    let html = `
      <div class="fgg-tooltip-header">
        <span class="fgg-tooltip-title ${headerClass}">${verdictLabel}</span>
      </div>
      <div class="fgg-tooltip-body">
    `;

    if (analysis.flags.length > 0) {
      const tosFlags = analysis.flags.filter(f => f.categoryId !== "KEYWORD_STUFFING_REDUNDANCY");
      const redundancyFlags = analysis.flags.filter(f => f.categoryId === "KEYWORD_STUFFING_REDUNDANCY");

      // 1. Critical / High Risk Policy Breaches (e.g. FTMO, Decompile, Win Rate, WhatsApp)
      if (tosFlags.length > 0) {
        html += `
          <div class="fgg-section-label danger-text">Forbidden Trigger Words:</div>
          <div class="fgg-flags-list">
            ${tosFlags.map(f => `<span class="fgg-flag-chip">${escapeHtml(f.matchedWord)}</span>`).join("")}
          </div>
          <div class="fgg-policy-rule">
            <strong>Fiverr Policy:</strong> ${escapeHtml(tosFlags[0].fiverrRule)}<br>
            <span style="font-size:10px; color:#cbd5e1; display:block; margin-top:2px;">${escapeHtml(tosFlags[0].description)}</span>
          </div>
          <div class="fgg-legacy-notice">
            Yeh words Fiverr Community Standards ke khilaf hain. In se gig delete ya warning strike aa sakti hai.
          </div>
        `;
      }

      // 2. Keyword Stuffing / Duplicate Synonyms (e.g. EA + Expert Advisor)
      if (redundancyFlags.length > 0) {
        html += `
          <div class="fgg-section-label warning-text">Duplicate Synonyms (Repetitive Keywords):</div>
          <div class="fgg-flags-list">
            ${redundancyFlags.map(f => `<span class="fgg-flag-chip warning">${escapeHtml(f.matchedWord)}</span>`).join("")}
          </div>
          <div class="fgg-policy-rule warning">
            <strong>Fiverr Editor Rule:</strong> ${escapeHtml(redundancyFlags[0].fiverrRule)}<br>
            <span style="font-size:10px; color:#fde68a; display:block; margin-top:2px;">${escapeHtml(redundancyFlags[0].description)}</span>
          </div>
          <div class="fgg-legacy-notice">
            Word 'EA' apne aap mein bilkul SAFE hai. Masla sirf aik hi title mein duplicate synonyms repeat karne ka hai.
          </div>
        `;
      }

      if (analysis.safeAlternative) {
        html += `
          <div class="fgg-alt-box">
            <span class="fgg-alt-title">Safe Alternative:</span>
            <span style="font-family:monospace; font-size:11px;">"${escapeHtml(analysis.safeAlternative)}"</span>
            <button type="button" class="fgg-copy-btn" id="fgg-floating-copy-btn" data-copy="${escapeHtml(analysis.safeAlternative)}">Copy</button>
          </div>
        `;
      }
    } else {
      html += `
        <div style="color:#34d399; font-size:11px; font-weight:600; margin-bottom:2px;">No Issues Found</div>
        <div style="font-size:10px; color:#94a3b8;">Yeh title Fiverr guidelines ke mutabiq thek hai.</div>
      `;
    }

    html += `</div>`;
    tooltip.innerHTML = html;
    document.body.appendChild(tooltip);
    activeFloatingTooltip = tooltip;

    // Position tooltip right below or above the tag
    const rect = anchorElem.getBoundingClientRect();
    const tooltipWidth = 300;
    let left = rect.left;
    let top = rect.bottom + 6;

    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }
    if (left < 10) left = 10;

    if (top + 200 > window.innerHeight) {
      top = rect.top - tooltip.offsetHeight - 6;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    const copyBtn = tooltip.querySelector("#fgg-floating-copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const text = copyBtn.getAttribute("data-copy");
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => { copyBtn.textContent = "Copy"; }, 1500);
        });
      });
    }

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

    const panel = document.createElement("div");
    panel.className = "fgg-editor-panel";
    panel.innerHTML = `
      <div class="fgg-editor-header">
        <div class="fgg-editor-brand">
          Fiverr Title Checker <span class="fgg-editor-brand-tag">Live</span>
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
            <span class="fgg-alert-title">Title Checker Ready</span>
            <span>Apna title likhein. Koi forbidden word hoga to foran alert aayega.</span>
          </div>
        `;
        return;
      }

      const res = engine.analyze(currentVal);

      let bannerClass = "safe";
      let bannerTitle = "Safe & Compliant";
      if (res.verdict === "DANGER") {
        bannerClass = "danger";
        bannerTitle = "Warning: Banned Words Found";
      } else if (res.verdict === "HIGH_RISK") {
        bannerClass = "high-risk";
        bannerTitle = "Warning: Risky Phrasing";
      } else if (res.verdict === "CAUTION") {
        bannerClass = "caution";
        bannerTitle = "Notice: Needs Adjustment";
      }

      let contentHtml = `
        <div class="fgg-alert-banner ${bannerClass}">
          <div class="fgg-alert-title">${bannerTitle}</div>
          <div>${escapeHtml(res.summaryMessage)}</div>
      `;

      if (res.flags.length > 0) {
        contentHtml += `
          <div class="fgg-detected-words-row">
            <span class="fgg-detected-label">Words:</span>
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
      scanGigTitles();
      scanGigEditor();
    }, 150);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial runs
  scanGigTitles();
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
