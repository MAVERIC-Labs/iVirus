---
title: Documentation
description: Tool guides and workflows for viral informatics.
layout: layouts/docs.njk
doctype: guide
permalink: /docs/
noHeader: true
---

{% hero
  "Documentation",
  "Tool guides and workflows for viral informatics.",
  "hero--docs",
  "/assets/img/hero/docs-notebook.svg",
  "animate"
%}

## The iVirus Pipeline

Follow these eight steps to go from raw sequencing reads to annotated and classified viral populations. Click any tool name to jump to its full guide.

<figure class="pipeline-fig">
  <img src="/assets/img/pipeline-flow.svg" alt="iVirus viromics pipeline overview: Raw Reads → QC & Trim → Assembly → Viral ID → Gene Calling → Annotation → Taxonomy → Ecology & Visualization" width="920" height="180" loading="eager">
</figure>

| Step | Goal | Key tools |
|------|------|-----------|
| **1 · Raw Reads** | Start with FASTQ files from your sequencer or the SRA | — |
| **2 · QC & Trim** | Assess read quality; remove adapters and low-quality bases | [FastQC](/docs/tools/fastqc/), [BBDuk](/docs/tools/bbduk/), [fastp](/docs/tools/fastp/placeholder/), [MultiQC](/docs/tools/multiqc/), [Trimmomatic](/docs/tools/trimmomatic/) |
| **3 · Assembly** | Assemble short reads into contigs | [MetaSPAdes](/docs/tools/metaspades/placeholder/), [MEGAHIT](/docs/tools/megahit/), [SPAdes](/docs/tools/spades/) |
| **4 · Viral ID** | Detect viral contigs; assess genome quality and completeness | [VirSorter2](/docs/tools/virsorter2/placeholder/), [VIBRANT](/docs/tools/vibrant/), [VirSorter](/docs/tools/virsorter/), [CheckV](/docs/tools/checkv/) |
| **5 · Gene Calling** | Predict protein-coding genes from viral contigs | [Prodigal](/docs/tools/prodigal/), [Prokka](/docs/tools/prokka/placeholder/) |
| **6 · Annotation** | Annotate gene functions; identify auxiliary metabolic genes | [DRAM-v](/docs/tools/dram-v/), [VIGA](/docs/tools/viga/), [Cenote-Taker 2](/docs/tools/cenote-taker2/placeholder/) |
| **7 · Taxonomy** | Classify viral genomes into genus-level groups | [vConTACT2](/docs/tools/vcontact2/), [VIRIDIC](/docs/tools/viridic/), [CAT/BAT](/docs/tools/cat-bat/) |
| **8 · Ecology & Viz** | Predict hosts; estimate abundance; explore community structure | [iPHoP](/docs/tools/iphop/), [WIsH](/docs/tools/wish/), [Anvi'o](/docs/tools/anvio/), [Cytoscape](/docs/tools/cytoscape/) |

---

## Workflows

Step-by-step walkthroughs that connect the tools above into complete analyses.

<div class="wf-groups">
{% for wfkey, wf in workflows %}
  <details class="wf-details" {% if false %}open{% endif %}>
    <summary>
      <span class="wf-name">{{ wf.title }}</span>
      <span class="wf-count">{{ wf.steps | length }} steps</span>
    </summary>
    <ul class="wf-steps">
      {% for s in wf.steps %}
      <li><a href="{{ s.url }}">{{ s.title }}</a></li>
      {% endfor %}
    </ul>
  </details>
{% endfor %}
</div>

---

## Tool Guides

<ul class="tool-guide-list">
{% for p in collections.toolGuides | sort(false, false, "data.title") %}
  <li><a href="{{ p.url }}">{{ p.data.title }}</a></li>
{% endfor %}
</ul>
