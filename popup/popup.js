/**
 * Fiverr Gig Guardian — Popup Controller
 * Manages Title Inspector, Policy Catalog, and Extension Preferences.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Engine
  const engine = new RiskAnalysisEngine(FIVERR_POLICY_DATABASE);

  // Tab Switching
  const tabBtns = document.querySelectorAll(".fgg-tab-btn");
  const tabContents = document.querySelectorAll(".fgg-tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const targetContent = document.getElementById(`tab-${targetTab}`);
      if (targetContent) targetContent.classList.add("active");
    });
  });

  // UI Elements in Inspector
  const titleInput = document.getElementById("fgg-title-input");
  const charPill = document.getElementById("fgg-char-pill");
  const resultCard = document.getElementById("fgg-result-card");
  const verdictElem = document.getElementById("fgg-result-verdict");
  const riskBadge = document.getElementById("fgg-risk-badge");
  const messageElem = document.getElementById("fgg-result-message");

  const flagsSection = document.getElementById("fgg-flags-section");
  const flagChips = document.getElementById("fgg-flag-chips");
  const ruleBox = document.getElementById("fgg-rule-box");
  const ruleTitle = document.getElementById("fgg-rule-title");
  const ruleDesc = document.getElementById("fgg-rule-desc");

  const altSection = document.getElementById("fgg-alt-section");
  const altText = document.getElementById("fgg-alt-text");
  const copyAltBtn = document.getElementById("fgg-copy-alt-btn");

  // Live Inspector Handler
  function runInspection() {
    const text = (titleInput.value || "").trim();
    const len = (titleInput.value || "").length;

    // Update char counter
    charPill.textContent = `${len} / 80 chars`;
    charPill.className = "fgg-char-pill";
    if (len > 80) {
      charPill.classList.add("exceeded");
    } else if (len >= 40 && len <= 70) {
      charPill.classList.add("optimal");
    } else if (len > 0) {
      charPill.classList.add("warning");
    }

    if (!text) {
      resultCard.className = "fgg-result-card";
      verdictElem.textContent = "Ready for Analysis";
      verdictElem.className = "fgg-result-status";
      riskBadge.textContent = "Score: 0/100";
      messageElem.textContent = "Type or paste a title above to inspect for forbidden words, syntax errors, and Fiverr account strike risks.";
      flagsSection.style.display = "none";
      altSection.style.display = "none";
      return;
    }

    const res = engine.analyze(text);

    // Update Card Styling & Verdict
    resultCard.className = `fgg-result-card ${res.verdict.toLowerCase().replace('_', '-')}`;
    verdictElem.className = `fgg-result-status ${res.verdict.toLowerCase().replace('_', '-')}`;
    verdictElem.textContent = res.verdict.replace("_", " ");
    riskBadge.textContent = `Score: ${res.score}/100`;
    messageElem.textContent = res.summaryMessage;

    // Flags Section
    if (res.flags.length > 0) {
      flagsSection.style.display = "block";
      flagChips.innerHTML = res.flags
        .map(f => `<span class="fgg-flag-chip ${f.categoryId === 'KEYWORD_STUFFING_REDUNDANCY' ? 'warning' : ''}">${escapeHtml(f.matchedWord)}</span>`)
        .join("");

      const primaryFlag = res.flags[0];
      ruleTitle.textContent = `Rule: ${primaryFlag.fiverrRule} (${primaryFlag.categoryName})`;
      ruleDesc.textContent = primaryFlag.description;
    } else {
      flagsSection.style.display = "none";
    }

    // Suggestions Section
    if (res.safeAlternative) {
      altSection.style.display = "block";
      altText.textContent = res.safeAlternative;
    } else {
      altSection.style.display = "none";
    }
  }

  titleInput.addEventListener("input", runInspection);
  titleInput.addEventListener("keyup", runInspection);

  // Sample Buttons
  const sampleBtns = document.querySelectorAll(".fgg-sample-btn");
  sampleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const sample = btn.getAttribute("data-sample");
      titleInput.value = sample;
      runInspection();
    });
  });

  // Copy Alternative Button
  copyAltBtn.addEventListener("click", () => {
    const textToCopy = altText.textContent;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      copyAltBtn.textContent = "Copied to Clipboard!";
      setTimeout(() => {
        copyAltBtn.textContent = "Copy Safe Title";
      }, 1500);
    });
  });

  // Render Policy Catalog Tab
  const policyListElem = document.getElementById("fgg-policy-list");
  if (policyListElem && FIVERR_POLICY_DATABASE.categories) {
    let listHtml = "";
    Object.values(FIVERR_POLICY_DATABASE.categories).forEach(cat => {
      const sevClass = cat.severity.toLowerCase();
      listHtml += `
        <div class="fgg-policy-card">
          <div class="fgg-policy-card-header">
            <span class="fgg-policy-name">${escapeHtml(cat.name)}</span>
            <span class="fgg-severity-tag ${sevClass}">${cat.severity}</span>
          </div>
          <div class="fgg-policy-card-desc">${escapeHtml(cat.description)}</div>
          <div class="fgg-policy-card-rule">Fiverr Standard: ${escapeHtml(cat.fiverrRule)}</div>
        </div>
      `;
    });
    policyListElem.innerHTML = listHtml;
  }

  // Load / Save Settings
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    const searchToggle = document.getElementById("setting-search-scanner");
    const editorToggle = document.getElementById("setting-editor-scanner");
    const charToggle = document.getElementById("setting-char-enforcer");

    chrome.storage.local.get(["fgg_search", "fgg_editor", "fgg_char"], (data) => {
      if (data.fgg_search !== undefined) searchToggle.checked = data.fgg_search;
      if (data.fgg_editor !== undefined) editorToggle.checked = data.fgg_editor;
      if (data.fgg_char !== undefined) charToggle.checked = data.fgg_char;
    });

    searchToggle.addEventListener("change", () => {
      chrome.storage.local.set({ fgg_search: searchToggle.checked });
    });
    editorToggle.addEventListener("change", () => {
      chrome.storage.local.set({ fgg_editor: editorToggle.checked });
    });
    charToggle.addEventListener("change", () => {
      chrome.storage.local.set({ fgg_char: charToggle.checked });
    });
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
