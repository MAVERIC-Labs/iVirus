const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const workflows = require("./src/_data/workflows.json");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  // Capture the configured md instance (with syntax highlighting) for use in shortcodes
  let mdLib;
  eleventyConfig.amendLibrary("md", lib => { mdLib = lib; });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addCollection("workflows", api =>
  api.getFilteredByGlob("src/docs/workflows/*.{md,njk}")
  );
  eleventyConfig.addCollection("toolGuides", api =>
    api.getFilteredByGlob("src/docs/tools/*.{md,njk}")
  );
  eleventyConfig.addCollection("guides", api =>
    api.getFilteredByGlob("src/docs/guides/*.{md,njk}")
  );
  eleventyConfig.addCollection("protocols", api =>
  api.getFilteredByGlob("src/protocols/*.{md,njk}")
     .filter(p =>
       p.fileSlug !== "index" &&
       p.url !== "/protocols/" &&
       !p.inputPath.endsWith("index.njk")
     )
  );

  // To handle the protocols.io widgits
  eleventyConfig.addShortcode("protocols", (id) => {
  const raw = String(id || "").trim();

  // If a dx.doi.org URL was passed, extract the DOI after the domain
  const m = raw.match(/dx\.doi\.org\/(.+)$/);
  let doi = m ? m[1] : raw;

  // If it’s just a short code (e.g., "buisnuee"), build the full DOI
  if (!doi.startsWith("10.")) {
    doi = `10.17504/protocols.io.${doi}`;
  }

  // Use the official widgets endpoint (shows views/bookmarks/forks)
  const src = `https://www.protocols.io/widgets/doi?uri=dx.doi.org/${encodeURIComponent(doi)}`;

  return `
  <div class="proto-embed">
    <iframe
      src="${src}"
      title="protocols.io"
      loading="lazy"
      style="width:100%;height:260px;border:0;">
    </iframe>
  </div>`;
  });

  eleventyConfig.addShortcode("youtube", id => `
  <div class="video">
    <iframe src="https://www.youtube.com/embed/${id}" title="YouTube" loading="lazy" allowfullscreen></iframe>
  </div>`);

  eleventyConfig.addShortcode("figure", (src, alt = "", caption = "") => `
  <figure class="fig">
    <img src="${src}" alt="${alt}">
    ${caption ? `<figcaption>${caption}</figcaption>` : ""}
  </figure>`);

  eleventyConfig.addShortcode("hero", (title, subtitle = "", variant = "", bg = "", animate = "") => {
    const sub = subtitle ? `<p class="muted">${subtitle}</p>` : "";
    const cls = [
      "hero",
      "page-hero",
      variant || "",
      bg ? "hero--hasbg" : "",
      (animate && animate !== "false") ? "hero--anim" : ""
    ].filter(Boolean).join(" ");
  
    // Inline CSS var only if a background was provided
    const style = bg ? ` style="--hero-bg: url('${bg}')"` : "";
  
    return `
    <section class="${cls}"${style}>
      <h1>${title}</h1>
      ${sub}
    </section>
    `;
  });

  eleventyConfig.addPairedShortcode("admon", function(content, kind = "note", title = "Note") {
    return `<div class="admon admon-${kind}"><strong>${title}:</strong> ${content}</div>`;
  });

  eleventyConfig.addShortcode("workflowStepper", (flow = "metagenome", activeId) => {
    const wf = workflows[flow];
    if (!wf || !Array.isArray(wf.steps)) return "";
  
    // Build each step (icon + label, highlight active)
    const parts = wf.steps.map((s) => {
      const active = s.id === activeId ? "active" : "";
      const icon = s.icon ? `<span class="icon" aria-hidden="true">${s.icon}</span>` : "";
      return `<li class="wf-step ${active}">
        <a href="${s.url}">
          ${icon}<span class="label">${s.title}</span>
        </a>
      </li>`;
    });
  
    // Insert chevrons between items
    const withChevrons = [];
    parts.forEach((html, i) => {
      withChevrons.push(html);
      if (i < parts.length - 1) withChevrons.push(`<li class="wf-chevron" aria-hidden="true">»»</li>`);
    });
  
    return `<nav class="wf" aria-label="${wf.title}">
      <h4 class="wf-title">${wf.title}</h4>
      <ol class="wf-steps">
        ${withChevrons.join("\n")}
      </ol>
    </nav>`;
  });

  eleventyConfig.addPairedShortcode("codetabs", (content, tabs = []) => {
    const id = Math.random().toString(36).slice(2);
    const buttons = tabs.map((t, i) =>
      `<button type="button" data-tab="${i}" role="tab" aria-selected="${i ? "false" : "true"}" ${i ? "" : "class='active'"}>${t}</button>`
    ).join("");

    // Split on a line containing only "---" and render each part as markdown
    const parts = content.split(/\n[ \t]*---[ \t]*\n/);
    const panels = parts.map((part, i) => {
      const html = mdLib ? mdLib.render(part.trim()) : `<pre>${part}</pre>`;
      return `<div class="codetabs-panel" data-panel="${i}" role="tabpanel"${i !== 0 ? ' hidden' : ''}>${html}</div>`;
    }).join("");

    return `<div class="codetabs" id="tabs-${id}" data-codetabs>
  <div class="codetabs-nav" data-codetabs-nav role="tablist">${buttons}</div>
  <div class="codetabs-panels" data-codetabs-panels>${panels}</div>
</div>`;
  });

  eleventyConfig.addGlobalData("defaultLayout", "layouts/docs.njk");

  // Sort by ISO date field (asc or desc)
  eleventyConfig.addFilter("sortByDate", function(items, key = "date", dir = "asc") {
    if (!Array.isArray(items)) return [];
    const toDate = v => (v instanceof Date ? v : new Date(v));
    const sign = dir === "desc" ? -1 : 1;
    return [...items]
      .filter(i => i && i[key])
      .sort((a, b) => {
        const da = toDate(a[key]); const db = toDate(b[key]);
        const ta = isNaN(+da) ? 0 : +da;
        const tb = isNaN(+db) ? 0 : +db;
        return (ta - tb) * sign;
      });
  });

  // Keep your existing byType (or add if you don't have it)
  eleventyConfig.addFilter("byType", function(items, type) {
    if (!Array.isArray(items)) return [];
    return items.filter(w => w && w.type === type);
  });

  // Friendly date like "Nov 12, 2023"
  eleventyConfig.addFilter("dateFmt", function(iso, locale = "en-US") {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "2-digit" }).format(d);
    } catch { return iso; }
  });

  // Count
  eleventyConfig.addFilter("count", arr => Array.isArray(arr) ? arr.length : 0);

  // Look up a single tool record from tools.items by its slug field
  eleventyConfig.addFilter("findBySlug", function(items, slug) {
    if (!Array.isArray(items) || !slug) return null;
    return items.find(t => t.slug === slug) || null;
  });

  // Tool guides grouped by tools.json category — used in the docs sidebar.
  eleventyConfig.addCollection("toolGuidesGrouped", (api) => {
    const items = api.getFilteredByGlob("src/docs/tools/*.{md,njk}");

    // Pull tools data (categories live at the top level; items are a flat list).
    const all = api.getAll();
    const toolsData = all[0]?.data?.tools || {};
    const categories = toolsData.categories || [];
    const toolItems  = toolsData.items || [];

    // Build slug → { category, title } from tools.json `items`.
    const toolToCategory = {};
    const toolDefaults   = {};
    for (const t of toolItems) {
      const slug = (t.slug || t.id || "").toLowerCase();
      if (!slug) continue;
      toolToCategory[slug] = t.category;
      toolDefaults[slug]   = { title: t.name || t.title };
    }

    const byTitle = (a, b) =>
      (a.data.title || a.fileSlug || "").localeCompare(
        b.data.title || b.fileSlug || "",
        undefined,
        { sensitivity: "base" }
      );

    // Build plain records (do NOT spread the eleventy template object itself).
    const enriched = items.map(p => {
      const toolId   = (p.data.toolId || p.fileSlug || "").toLowerCase();
      const category = p.data.category || toolToCategory[toolId] || "other";
      const title    = p.data.title || toolDefaults[toolId]?.title || p.fileSlug;

      return {
        url: p.url,
        fileSlug: p.fileSlug,
        data: {
          ...p.data,
          toolId,
          category,
          title
        }
      };
    }).sort(byTitle);

    const groups = {};
    for (const r of enriched) (groups[r.data.category] ||= []).push(r);
    Object.values(groups).forEach(list => list.sort(byTitle));

    return { items: enriched, groups, categories };
  });

  eleventyConfig.addFilter("hasDocForId", (items, id) =>
  (items || []).some(p => (p.data.toolId || p.fileSlug) === id)
  );

  // Group by year of an ISO date
  eleventyConfig.addFilter("groupByYear", (items, key = "date") => {
    if (!Array.isArray(items)) return [];
  
    const getYear = (it) => {
      const v = it?.[key] ?? it?.data?.[key];
  
      // Number: 2022
      if (typeof v === "number" && isFinite(v)) return Math.trunc(v);
  
      // String numeric: "2022"
      if (typeof v === "string" && /^\d{4}$/.test(v)) return parseInt(v, 10);
  
      // Date object
      if (v instanceof Date && !isNaN(+v)) return v.getUTCFullYear();
  
      // Date-like string: "2022-05-11", "2022/05/11", etc.
      if (typeof v === "string") {
        const d = new Date(v);
        if (!isNaN(+d)) return d.getUTCFullYear();
      }
  
      return "Unknown";
    };
  
    const map = new Map(); // year -> items[]
    for (const it of items) {
      const y = getYear(it);
      if (!map.has(y)) map.set(y, []);
      map.get(y).push(it);
    }
  
    // Sort: numeric years desc first, then "Unknown" last
    return [...map.entries()]
      .map(([year, list]) => ({ year, items: list }))
      .sort((a, b) => {
        const aU = a.year === "Unknown", bU = b.year === "Unknown";
        if (aU && !bU) return 1;
        if (bU && !aU) return -1;
        return (b.year || 0) - (a.year || 0);
      });
  });

  // To break up publications page
  eleventyConfig.addFilter("byTag", function(items, tag) {
    if (!Array.isArray(items)) return [];
    return items.filter(p => Array.isArray(p.tags) && p.tags.includes(tag));
  });
  eleventyConfig.addFilter("withoutTag", function(items, tag) {
    if (!Array.isArray(items)) return [];
    return items.filter(p => !Array.isArray(p.tags) || !p.tags.includes(tag));
  });

  // Minimal date filter for Nunjucks (supports "yyyy" and "yyyy-LL-dd")
  eleventyConfig.addFilter("dateISO", function (input = "now", fmt = "yyyy-LL-dd") {
    const d = (input === "now" || !input) ? new Date() : new Date(input);
    if (isNaN(d)) return "";

    const pad = n => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const LL = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());

    if (fmt === "yyyy") return String(yyyy);
    if (fmt === "yyyy-LL-dd") return `${yyyy}-${LL}-${dd}`;
    // Fallback: ISO date
    return `${yyyy}-${LL}-${dd}`;
  });

  //
  eleventyConfig.addFilter("concat", function (arr, val) {
  if (!Array.isArray(arr)) arr = [];
  if (Array.isArray(val)) return arr.concat(val);
  return arr.concat([val]);
  });

  return {
    pathPrefix: process.env.IVIRUS_DEPLOY ? "/iVirus/" : "/",
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
