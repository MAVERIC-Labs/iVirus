document.addEventListener("DOMContentLoaded", () => {
  const dataRoot = document.querySelector("[data-filter-kind='datasets']");
  if (dataRoot) initDatasetFilters(dataRoot);

  const publicationsRoot = document.querySelector("[data-filter-kind='publications']");
  if (publicationsRoot) initPublicationFilters(publicationsRoot);

  const protocolsRoot = document.querySelector("[data-filter-kind='protocols']");
  if (protocolsRoot) {
    initProtocolFilters(protocolsRoot);
    initProtocolWidgets(protocolsRoot);
  }
});

function initDatasetFilters(root) {
  const query = document.querySelector("#q");
  const platform = document.querySelector("#platform");
  const type = document.querySelector("#type");
  const items = Array.from(document.querySelectorAll("#dataGrid .dataset"));

  if (!query || !platform || !type || items.length === 0) return;

  function apply() {
    const queryValue = (query.value || "").toLowerCase().trim();
    const platformValue = (platform.value || "").toLowerCase();
    const typeValue = (type.value || "").toLowerCase();

    items.forEach((item) => {
      const title = item.dataset.title || "";
      const platforms = item.dataset.platform || "";
      const types = (item.dataset.type || "").split(",");
      const matchesQuery = !queryValue || title.includes(queryValue);
      const matchesPlatform = !platformValue || platforms.split(",").some((value) => value.trim() === platformValue);
      const matchesType = !typeValue || types.some((value) => value.trim() === typeValue);
      item.style.display = matchesQuery && matchesPlatform && matchesType ? "" : "none";
    });
  }

  query.addEventListener("input", apply);
  platform.addEventListener("change", apply);
  type.addEventListener("change", apply);
}

function initPublicationFilters(root) {
  const query = document.querySelector("#pubQ");
  const onlyIvirus = document.querySelector("#onlyIvirus");
  const onlyOA = document.querySelector("#onlyOA");
  const publications = Array.from(document.querySelectorAll(".pubs-list .pub"));

  if (!query || !onlyIvirus || !onlyOA || publications.length === 0) return;

  function apply() {
    const search = (query.value || "").toLowerCase().trim();
    const needIvirus = onlyIvirus.checked;
    const needOA = onlyOA.checked;

    publications.forEach((publication) => {
      const haystack = [
        publication.dataset.title,
        publication.dataset.authors,
        publication.dataset.venue,
        publication.dataset.doi
      ].join(" ");
      const tags = publication.dataset.tags || "";
      const matchesQuery = !search || haystack.includes(search);
      const matchesIvirus = !needIvirus || tags.includes("uses-ivirus");
      const matchesOA = !needOA || tags.includes("open-access");
      publication.style.display = matchesQuery && matchesIvirus && matchesOA ? "" : "none";
    });
  }

  query.addEventListener("input", apply);
  onlyIvirus.addEventListener("change", apply);
  onlyOA.addEventListener("change", apply);
}

function initProtocolFilters(root) {
  const platform = root.querySelector("#f-platform");
  const host = root.querySelector("#f-host");
  const query = root.querySelector("#f-search");
  const resultCount = root.querySelector("#result-count");
  const cards = Array.from(root.querySelectorAll(".protocol.card"));

  if (!platform || !host || !query || cards.length === 0) return;

  function normalize(value) {
    return (value || "").toLowerCase();
  }

  function apply() {
    const platformValue = normalize(platform.value);
    const hostValue = normalize(host.value);
    const queryValue = normalize(query.value);

    cards.forEach((card) => {
      const cardPlatform = normalize(card.dataset.platform);
      const cardHost = normalize(card.dataset.host);
      const cardTitle = normalize(card.dataset.title);
      const matchesPlatform = !platformValue || cardPlatform === platformValue;
      const matchesHost = !hostValue || cardHost === hostValue;
      const matchesQuery = !queryValue || cardTitle.includes(queryValue);
      card.style.display = matchesPlatform && matchesHost && matchesQuery ? "" : "none";
    });

    if (resultCount) {
      const visible = cards.filter((card) => card.style.display !== "none").length;
      resultCount.textContent = visible + " of " + cards.length + " protocols";
    }
  }

  platform.addEventListener("change", apply);
  host.addEventListener("change", apply);
  query.addEventListener("input", apply);
  apply();
}

function initProtocolWidgets(root) {
  root.querySelectorAll(".js-show-widget").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      const slot = card ? card.querySelector(".js-widget-slot") : null;
      const doi = button.dataset.doi;

      if (!slot || !doi) return;

      const existing = slot.querySelector("iframe");
      if (existing) {
        const hidden = slot.hidden === true;
        slot.hidden = !hidden;
        button.textContent = slot.hidden ? "Show preview" : "Hide preview";
        return;
      }

      const iframe = document.createElement("iframe");
      iframe.src = "https://www.protocols.io/widgets/doi?uri=dx.doi.org/" + doi;
      iframe.title = "protocols.io";
      iframe.loading = "lazy";
      iframe.setAttribute("width", "100%");
      iframe.setAttribute("height", "320");
      iframe.setAttribute("style", "width:100%;height:320px;border:0;display:block;");

      slot.appendChild(iframe);
      slot.hidden = false;
      button.textContent = "Hide preview";
    });
  });
}
