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
          title: (data) => `${(data.tool && data.tool.name) || "Tool"} (placeholder)`,
        },
        // Return HTML from render()
      };
    }
  
    render(data) {
      const t = data.tool || {};
      const category = (t.category || "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const platforms = Array.isArray(t.platforms) ? t.platforms.join(", ") : "";
      const hasDocs = !!t.site_docs_url;
      const docLink = hasDocs
        ? `<a href="${withPrefix(t.site_docs_url)}">Go to full docs</a>`
        : `<em>This documentation is coming soon.</em>`;

      const official = t.official_url
        ? `<a href="${t.official_url}" target="_blank" rel="noopener">${t.official_url}</a>`
        : "_n/a_";
      const catUrl = withPrefix(t.category ? `/tools/${t.category}/` : "/tools/");
  
      // Optionally discourage indexing placeholders:
      const metaNoIndex = `<meta name="robots" content="noindex">`;
  
      return `
        ${metaNoIndex}
        <h1>${t.name || "Tool"}</h1>
        <p>${docLink}</p>
  
        <ul>
          <li>Category: <strong>${category}</strong></li>
          <li>Summary: ${t.summary || ""}</li>
          <li>Platforms: ${platforms}</li>
        </ul>
  
        <p>In the meantime:</p>
        <ul>
          <li>Official site: ${official}</li>
          <li>See related pages: <a href="${catUrl}">Tools catalogue</a></li>
        </ul>
      `.trim();
    }
  };