document.addEventListener("DOMContentLoaded", () => {
  initWorkflowSidebar();
  initDocsToc();
  initCodeTabs();
});

function initWorkflowSidebar() {
  document.querySelectorAll(".wf-parent").forEach((item) => {
    const button = item.querySelector(".wf-toggle");
    const nested = item.querySelector(".wf-steps-nested");
    const arrow = button ? button.querySelector(".arrow") : null;

    if (!button || !nested || !arrow) return;

    const isOpen = item.classList.contains("open");
    nested.hidden = !isOpen;
    arrow.textContent = isOpen ? "▾" : "▸";
    button.setAttribute("aria-expanded", String(isOpen));

    button.addEventListener("click", (event) => {
      event.preventDefault();
      const nextOpen = nested.hidden;
      nested.hidden = !nextOpen;
      arrow.textContent = nextOpen ? "▾" : "▸";
      button.setAttribute("aria-expanded", String(nextOpen));
      item.classList.toggle("open", nextOpen);
    });
  });
}

function initDocsToc() {
  document.querySelectorAll("[data-docs-toc]").forEach((container) => {
    const rootSelector = container.dataset.tocRoot || ".docs-content";
    const root = document.querySelector(rootSelector);
    const list = container.querySelector("[data-toc-list]");

    if (!root || !list) return;

    const headings = root.querySelectorAll("h2, h3");
    if (headings.length < 3) {
      container.hidden = true;
      return;
    }

    list.innerHTML = "";
    headings.forEach((heading) => {
      const id = heading.id || slugify(heading.textContent || "");
      if (!id) return;
      if (!heading.id) heading.id = id;

      const item = document.createElement("li");
      if (heading.tagName.toLowerCase() === "h3") {
        item.className = "toc-sub";
      }

      const link = document.createElement("a");
      link.href = "#" + id;
      link.textContent = heading.textContent || "";
      item.appendChild(link);
      list.appendChild(item);
    });
  });
}

function initCodeTabs() {
  document.querySelectorAll("[data-codetabs]").forEach((root) => {
    const buttons = Array.from(root.querySelectorAll("[data-codetabs-nav] button"));
    const panels = Array.from(root.querySelectorAll("[data-codetabs-panels] > div"));

    if (buttons.length === 0 || panels.length === 0) return;

    function activate(index) {
      buttons.forEach((button, buttonIndex) => {
        const active = buttonIndex === index;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
      });

      panels.forEach((panel, panelIndex) => {
        panel.hidden = panelIndex !== index;
      });
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        activate(Number(button.dataset.tab || 0));
      });
    });

    activate(0);
  });
}

function slugify(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
