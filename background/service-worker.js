/**
 * Fiverr Gig Guardian — Background Service Worker (Manifest V3)
 * Handles installation lifecycle and default storage settings.
 */

chrome.runtime.onInstalled.addListener((details) => {
  console.log("[Fiverr Gig Guardian] Installed successfully. Reason:", details.reason);

  // Set default settings
  chrome.storage.local.get(["fgg_search", "fgg_editor", "fgg_char"], (res) => {
    const defaults = {};
    if (res.fgg_search === undefined) defaults.fgg_search = true;
    if (res.fgg_editor === undefined) defaults.fgg_editor = true;
    if (res.fgg_char === undefined) defaults.fgg_char = true;

    if (Object.keys(defaults).length > 0) {
      chrome.storage.local.set(defaults);
    }
  });
});
