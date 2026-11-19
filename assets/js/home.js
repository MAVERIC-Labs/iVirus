document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector("[data-home-hero]");
  if (!hero) return;

  const titleEl = hero.querySelector("[data-home-hero-title]");
  const subEl = hero.querySelector("[data-home-hero-sub]");
  const ctasEl = hero.querySelector("[data-home-hero-ctas]");
  // Site root including the GitHub Pages prefix (e.g. "/iVirus"), set in index.njk
  const base = (hero.dataset.base || "/").replace(/\/$/, "");
  const dots = Array.from(hero.querySelectorAll(".hero-indicators .dot"));

  if (!titleEl || !subEl || !ctasEl || dots.length === 0) return;

  const slides = [
    {
      title: "Tools, Data, & Guides for Viral Research",
      sub: "A community resource for viral ecology: learn the pipeline from SRA fetch to viral identification, run tools, and grab datasets - all in one place.",
      ctas: [
        { text: "Get started", href: "/docs/" },
        { text: "Explore tools", href: "/tools/", ghost: true }
      ]
    },
    {
      title: "Reproducible Viral Protocols",
      sub: "Browse step-by-step protocols (Protocols.io & KBase narratives) and connect them to our tool guides and workflows.",
      ctas: [
        { text: "Browse Protocols", href: "/protocols/" },
        { text: "Read the Docs", href: "/docs/", ghost: true }
      ]
    },
    {
      title: "Curated viral datasets",
      sub: "Jumpstart analyses with reference catalogs, read sets, and benchmarking datasets annotated for viruses.",
      ctas: [
        { text: "Get datasets", href: "/data/" },
        { text: "Publications", href: "/publications/", ghost: true }
      ]
    },
    {
      title: "Compute platforms",
      sub: "Where we run: CyVerse & KBase resources that power training and analysis.",
      ctas: [
        { text: "Platforms", href: "/platforms/" },
        { text: "About iVirus", href: "/about/", ghost: true }
      ]
    }
  ];

  let currentIndex = 0;
  let timer = null;
  const intervalMs = 7000;

  function renderSlide(slide) {
    titleEl.textContent = slide.title;
    subEl.textContent = slide.sub;
    ctasEl.innerHTML = "";

    slide.ctas.forEach((cta) => {
      const link = document.createElement("a");
      link.className = "btn" + (cta.ghost ? " btn-ghost" : "");
      link.href = base + cta.href;
      link.textContent = cta.text;
      ctasEl.appendChild(link);
    });

  }

  function updateDots(index) {
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
  }

  function fadeOutIn(callback) {
    const copy = hero.querySelector(".hero-copy");
    if (!copy) {
      callback();
      return;
    }

    copy.classList.add("fading");
    window.setTimeout(() => {
      callback();
      copy.classList.remove("fading");
    }, 500);
  }

  function setSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    fadeOutIn(() => {
      renderSlide(slides[currentIndex]);
      updateDots(currentIndex);
    });
  }

  function stopTimer() {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    stopTimer();
    timer = window.setInterval(() => setSlide(currentIndex + 1), intervalMs);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setSlide(index);
      startTimer();
    });

    dot.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      setSlide(index);
      startTimer();
    });
  });

  setSlide(0);
  startTimer();
});
