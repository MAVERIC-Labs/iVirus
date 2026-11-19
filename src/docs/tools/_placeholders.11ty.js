// Always generate a unique placeholder for each tool.
function slugify(s = "") {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  // Mirrors the `pathPrefix` in .eleventy.js. This file builds raw href
  // strings in JS, so it can't use the Nunjucks `| url` filter.
  const pathPrefix = process.env.IVIRUS_DEPLOY ? "/iVirus" : "";
  // Only prefix root-relative internal paths; leave external URLs alone.
  const withPrefix = (url) =>
    url && url.startsWith("/") ? pathPrefix + url : url;
  
  module.exports = class {
    data() {
      return {
        pagination: {
          data: "tools.items",
          size: 1,
          alias: "tool",
          addAllPagesToCollections: false,
        },
        layout: "layouts/docs.njk",
        eleventyComputed: {
          permalink: (data) => {
            const t = data.tool || {};
            const slug = t.slug ? slugify(t.slug) : slugify(t.name || "tool");
            // Always write a unique placeholder URL (no `false`!)
            return `/docs/tools/${slug}/placeholder/`;
          },
          title: (data) => (data.tool && data.tool.name) || "Tool",
        },
        // Return HTML from render()
      };
    }
  
    render(data) {
      const t = data.tool || {};
      const cat = ((data.tools && data.tools.categories) || []).find((c) => c.id === t.category);
      const catUrl = withPrefix(t.category ? `/tools/${t.category}/` : "/tools/");
      const platforms = (Array.isArray(t.platforms) ? t.platforms : [])
        .map((p) => `<span class="badge badge--platform badge--${String(p).toLowerCase()}">${p}</span>`).join("");
      // Pipeline stages that use this tool (from workflows.json)
      const stages = [];
      for (const wf of Object.values(data.workflows || {})) {
        for (const s of wf.steps || []) {
          if ((s.tools || []).some((x) => x.slug === t.slug)) stages.push(s);
        }
      }
      const stageChips = stages.map((s) => `<a class="pipe-chip" href="${withPrefix(s.url)}">${s.title}</a>`).join("");

      return `
<meta name="robots" content="noindex">
<div class="tool-stub">
<p class="tool-stub-lead">${t.summary || ""}</p>
<div class="tool-meta-bar">${platforms}${cat ? `<span class="tool-meta-sep">·</span><a class="tool-meta-cat" href="${catUrl}">${cat.icon || ""} ${cat.title}</a>` : ""}${t.reference ? `<span class="tool-meta-sep">·</span><span class="tool-meta-ref">${t.reference}</span>` : ""}</div>
${stageChips ? `<div class="pipe-toolrow"><span class="pipe-lbl">Used in</span>${stageChips}</div>` : ""}
<div class="admon admon-note"><strong>Note:</strong> <em>This documentation is coming soon.</em> In the meantime, see the official site or the tools catalogue.</div>
<p class="tool-stub-actions">${t.official_url ? `<a class="btn" href="${t.official_url}" target="_blank" rel="noopener">Official site ↗</a>` : ""} <a class="btn btn-ghost" href="${catUrl}">All ${cat ? cat.title.toLowerCase() : ""} tools</a></p>
</div>`.trim();
    }
  };
