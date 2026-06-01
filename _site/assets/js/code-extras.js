document.addEventListener("DOMContentLoaded", ()=>{
  // Copy buttons on all code blocks
  document.querySelectorAll("pre > code").forEach(code=>{
    const pre = code.parentElement;
    const btn = document.createElement("button");
    btn.className = "copy-btn"; btn.type = "button"; btn.textContent = "Copy";
    btn.addEventListener("click", ()=>{
      navigator.clipboard.writeText(code.innerText).then(()=>{
        btn.textContent = "Copied!"; setTimeout(()=>btn.textContent="Copy", 1200);
      });
    });
    pre.appendChild(btn);
  });

  // Codetabs — tab switching
  document.querySelectorAll("[data-codetabs]").forEach(container => {
    const buttons = Array.from(container.querySelectorAll("[data-codetabs-nav] button"));
    const panels  = Array.from(container.querySelectorAll("[data-panel]"));
    buttons.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        panels.forEach(p => { p.hidden = parseInt(p.getAttribute("data-panel")) !== i; });
      });
    });
  });
});
