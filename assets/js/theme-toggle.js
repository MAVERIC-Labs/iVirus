// Robust theme toggle that always applies an explicit class and persists it.
// The pre-paint bootstrap in <head> sets a class on <html>; this script
// keeps the same class on <html> in sync and updates the toggle button.
(function(){
  const KEY = "ivirus-theme";
  const root = document.documentElement;
  const btn = document.querySelector("[data-theme-toggle]");

  function apply(mode){ // mode: 'theme-light' | 'theme-dark'
    root.classList.remove("theme-light","theme-dark");
    if(mode) root.classList.add(mode);
    try { localStorage.setItem(KEY, mode || ""); } catch(e){ /* ignore */ }
    if(btn){
      const dark = mode === "theme-dark";
      btn.setAttribute("aria-pressed", String(dark));
      btn.textContent = dark ? "🌙" : "☀️";
      btn.title = dark ? "Switch to light theme" : "Switch to dark theme";
    }
  }

  // Sync button label with whatever the bootstrap chose.
  const initial = root.classList.contains("theme-dark") ? "theme-dark" : "theme-light";
  if (btn) {
    const dark = initial === "theme-dark";
    btn.setAttribute("aria-pressed", String(dark));
    btn.textContent = dark ? "🌙" : "☀️";
    btn.title = dark ? "Switch to light theme" : "Switch to dark theme";
  }

  if(btn){
    btn.addEventListener("click", ()=>{
      const next = root.classList.contains("theme-dark") ? "theme-light" : "theme-dark";
      apply(next);
    });
  }
})();
