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

## The Viral Ecogenomics Pipeline

Follow these steps to go from raw sequencing reads to annotated and classified viral populations. Click any stage to open its walkthrough, or any tool name to jump to its full guide.

{% pipelineFigure "metagenome" %}

---

## Tool Guides

<ul class="tool-guide-list">
{% for p in collections.toolGuides | sort(false, false, "data.title") %}
  <li><a href="{{ p.url | url }}">{{ p.data.title }}</a></li>
{% endfor %}
</ul>
